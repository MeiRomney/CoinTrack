import expressRateLimit from "express-rate-limit";
import type {
  RateLimitRequestHandler,
  Options as RateLimitOptions,
} from "express-rate-limit";
import type { Request, Response } from "express";
import { getLogger } from "../utils/logger.ts";

const logger = getLogger();

export enum BucketType {
  IP = "ip",
  USER = "user",
  ORGANIZATION = "organization",
}

export interface RateLimitConfig {
  limit: number;
  window: number; // in milliseconds
  bucketType?: BucketType;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface ExtendedRequest extends Request {
  // Inherits user from global Express.User interface
  session: any; // Add session to match our usage
}

// Key generator function based on bucket type
function generateKey(bucketType: BucketType, req: ExtendedRequest): string {
  switch (bucketType) {
    case BucketType.USER:
      if (req.session?.user?.id) {
        return `user:${req.session.user.id}`;
      }
      // Fallback to IP if user is not authenticated
      return `ip:${req.ip}`;

    case BucketType.ORGANIZATION:
      if (req.session?.user?.organizationId) {
        return `org:${req.session.user.organizationId}`;
      }
      // Fallback to user if no organization, then to IP
      if (req.session?.user?.id) {
        return `user:${req.session.user.id}`;
      }
      return `ip:${req.ip}`;

    case BucketType.IP:
    default:
      return `ip:${req.ip}`;
  }
}

// Custom key generator for express-rate-limit
function createKeyGenerator(bucketType: BucketType) {
  return (req: Request): string => {
    return generateKey(bucketType, req as ExtendedRequest);
  };
}

// Rate limit handler with logging
function createRateLimitHandler(config: RateLimitConfig) {
  return (req: Request, res: Response): void => {
    const key = generateKey(
      config.bucketType || BucketType.IP,
      req as ExtendedRequest,
    );

    logger.warn("Rate limit exceeded", {
      key,
      ip: req.ip,
      method: req.method,
      path: req.path,
      userAgent: req.get("User-Agent"),
      bucketType: config.bucketType || BucketType.IP,
    });

    res.status(429).json({
      error: "Too Many Requests",
      message:
        config.message ||
        `Rate limit exceeded. Maximum ${config.limit} requests per ${config.window}ms.`,
      retryAfter: Math.ceil(config.window / 1000),
    });
  };
}

// Create rate limit middleware
export function createRateLimit(
  config: RateLimitConfig,
): RateLimitRequestHandler {
  const options: Partial<RateLimitOptions> = {
    windowMs: config.window,
    max: config.limit,
    keyGenerator: createKeyGenerator(config.bucketType || BucketType.IP),
    handler: createRateLimitHandler(config),
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: config.skipSuccessfulRequests || false,
    skipFailedRequests: config.skipFailedRequests || false,
  };

  return expressRateLimit(options);
}

// Convenience function for quick rate limiting setup
export function rateLimit(config: RateLimitConfig): RateLimitRequestHandler {
  return createRateLimit(config);
}

// Pre-configured rate limiters for common scenarios
export const commonRateLimits = {
  // Very strict for sensitive operations
  strict: (bucketType: BucketType = BucketType.IP) =>
    rateLimit({ limit: 5, window: 60000, bucketType }), // 5 per minute

  // Standard for most API endpoints
  standard: (bucketType: BucketType = BucketType.IP) =>
    rateLimit({ limit: 100, window: 60000, bucketType }), // 100 per minute

  // Lenient for public read operations
  lenient: (bucketType: BucketType = BucketType.IP) =>
    rateLimit({ limit: 1000, window: 60000, bucketType }), // 1000 per minute

  // Per-second limiting (as requested)
  perSecond: (limit: number, bucketType: BucketType = BucketType.IP) =>
    rateLimit({ limit, window: 1000, bucketType }), // custom per second
};

// Global rate limit middleware (applied to all routes)
export function createGlobalRateLimit(
  limit: number,
  windowMs: number,
): RateLimitRequestHandler {
  return createRateLimit({
    limit,
    window: windowMs,
    bucketType: BucketType.IP,
    message: "Global rate limit exceeded. Please slow down your requests.",
  });
}

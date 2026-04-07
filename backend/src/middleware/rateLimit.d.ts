import type { RateLimitRequestHandler } from "express-rate-limit";
import type { Request } from "express";
export declare enum BucketType {
    IP = "ip",
    USER = "user",
    ORGANIZATION = "organization"
}
export interface RateLimitConfig {
    limit: number;
    window: number;
    bucketType?: BucketType;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
export interface ExtendedRequest extends Request {
    session: any;
}
export declare function createRateLimit(config: RateLimitConfig): RateLimitRequestHandler;
export declare function rateLimit(config: RateLimitConfig): RateLimitRequestHandler;
export declare const commonRateLimits: {
    strict: (bucketType?: BucketType) => RateLimitRequestHandler;
    standard: (bucketType?: BucketType) => RateLimitRequestHandler;
    lenient: (bucketType?: BucketType) => RateLimitRequestHandler;
    perSecond: (limit: number, bucketType?: BucketType) => RateLimitRequestHandler;
};
export declare function createGlobalRateLimit(limit: number, windowMs: number): RateLimitRequestHandler;
//# sourceMappingURL=rateLimit.d.ts.map
import { Redis } from "ioredis";
import { getLogger } from "./logger.ts";

const logger = getLogger();

let redisClient: Redis | null = null;

/**
 * Get or create Redis client
 */
export function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }

  try {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      logger.warn(
        "REDIS_URL not configured - caching disabled, falling back to session-only validation",
      );
      return null;
    }

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err: Error) {
        logger.error("Redis connection error:", { error: err.message });
        return true;
      },
    });

    redisClient.on("connect", () => {
      logger.info("Redis connected successfully");
    });

    redisClient.on("error", (error: Error) => {
      logger.error("Redis error:", error);
    });

    redisClient.on("close", () => {
      logger.warn("Redis connection closed");
    });

    return redisClient;
  } catch (error: unknown) {
    logger.error("Failed to create Redis client:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Disconnect Redis client
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info("Redis disconnected");
  }
}

/**
 * Get cached value with fallback
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error: unknown) {
    logger.error("Redis GET error:", {
      key,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Set cached value with TTL (in seconds)
 */
export async function setCached(
  key: string,
  value: any,
  ttlSeconds: number,
): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error: unknown) {
    logger.error("Redis SET error:", {
      key,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Delete cached value
 */
export async function deleteCached(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error: unknown) {
    logger.error("Redis DEL error:", {
      key,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

import { Redis } from "ioredis";
/**
 * Get or create Redis client
 */
export declare function getRedisClient(): Redis | null;
/**
 * Disconnect Redis client
 */
export declare function disconnectRedis(): Promise<void>;
/**
 * Get cached value with fallback
 */
export declare function getCached<T>(key: string): Promise<T | null>;
/**
 * Set cached value with TTL (in seconds)
 */
export declare function setCached(key: string, value: any, ttlSeconds: number): Promise<boolean>;
/**
 * Delete cached value
 */
export declare function deleteCached(key: string): Promise<boolean>;
//# sourceMappingURL=redis.d.ts.map
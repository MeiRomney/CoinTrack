import axios from "axios";
import { getCached, setCached } from "../utils/redis.js";
import { getLogger } from "../utils/logger.js";
import config from "../config.js";
const logger = getLogger();
/**
 * Introspect token with OAuth2 server (with caching)
 *
 * Cache strategy:
 * - Cache valid tokens for 2 minutes (120 seconds)
 * - Cache invalid tokens for 30 seconds (prevent repeated checks)
 * - On error, return null (graceful degradation to session-based auth)
 */
export async function introspectToken(accessToken) {
    const cacheKey = `token:introspect:${accessToken}`;
    // Try cache first
    const cached = await getCached(cacheKey);
    if (cached !== null) {
        logger.debug("Token introspection cache hit", {
            active: cached.active,
            sub: cached.sub,
        });
        return cached;
    }
    // Cache miss - call OAuth2 server
    try {
        logger.debug("Token introspection cache miss - calling OAuth2 server");
        const response = await axios.post(`${config.oauth.serverUrl}/oauth2/introspect`, new URLSearchParams({
            token: accessToken,
            client_id: config.oauth.clientId,
            client_secret: config.oauth.clientSecret,
        }).toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            timeout: 5000, // 5 second timeout
        });
        const result = response.data;
        // Cache the result
        const ttl = result.active ? 120 : 30; // 2 min for valid, 30 sec for invalid
        await setCached(cacheKey, result, ttl);
        logger.info("Token introspection successful", {
            active: result.active,
            sub: result.sub,
            cachedFor: `${ttl}s`,
        });
        return result;
    }
    catch (error) {
        // Log error but return null for graceful degradation
        logger.error("Token introspection failed - falling back to session validation", {
            error: error.message,
            code: error.code,
            status: error.response?.status,
        });
        return null;
    }
}
/**
 * Validate token and check if it's active
 */
export async function isTokenActive(accessToken) {
    const result = await introspectToken(accessToken);
    // If introspection fails (OAuth2 server down), return true to fall back to session
    if (result === null) {
        logger.warn("Token introspection unavailable - trusting session");
        return true;
    }
    return result.active === true;
}
//# sourceMappingURL=token-validator.js.map
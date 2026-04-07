export interface TokenIntrospectionResult {
    active: boolean;
    scope?: string;
    client_id?: string;
    username?: string;
    token_type?: string;
    exp?: number;
    iat?: number;
    sub?: string;
    aud?: string;
    iss?: string;
    jti?: string;
}
/**
 * Introspect token with OAuth2 server (with caching)
 *
 * Cache strategy:
 * - Cache valid tokens for 2 minutes (120 seconds)
 * - Cache invalid tokens for 30 seconds (prevent repeated checks)
 * - On error, return null (graceful degradation to session-based auth)
 */
export declare function introspectToken(accessToken: string): Promise<TokenIntrospectionResult | null>;
/**
 * Validate token and check if it's active
 */
export declare function isTokenActive(accessToken: string): Promise<boolean>;
//# sourceMappingURL=token-validator.d.ts.map
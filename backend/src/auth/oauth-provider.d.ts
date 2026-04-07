import type { IAuthProvider, AuthUser, AuthTokens, AuthResult, LoginInitResult } from "./types.ts";
/**
 * OAuth 2.0 Authentication Provider
 *
 * Implements IAuthProvider using OAuth 2.0 PKCE flow.
 * Handles secure authentication with external OAuth server.
 */
export declare class OAuthProvider implements IAuthProvider {
    readonly name = "oauth";
    private readonly clientId;
    private readonly clientSecret;
    private readonly serverUrl;
    private readonly callbackUrl;
    private readonly scopes;
    constructor();
    /**
     * Initialize OAuth login - generates authorization URL
     */
    initiateLogin(sessionData?: {
        codeVerifier?: string;
        state?: string;
    }): Promise<LoginInitResult>;
    /**
     * Complete OAuth login - exchange code for tokens
     */
    completeLogin(params: {
        code: string;
        state: string;
        codeVerifier: string;
        expectedState: string;
    }): Promise<AuthResult>;
    /**
     * Validate OAuth token by fetching user info
     */
    validateToken(token: string): Promise<AuthUser | null>;
    /**
     * Refresh OAuth access token
     */
    refreshToken(refreshToken: string): Promise<AuthTokens | null>;
    /**
     * Logout - revoke OAuth tokens
     */
    logout(tokens: AuthTokens): Promise<boolean>;
    /**
     * Fetch user information from OAuth server
     */
    private fetchUserInfo;
}
//# sourceMappingURL=oauth-provider.d.ts.map
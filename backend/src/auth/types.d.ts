/**
 * Common authentication types and interfaces
 */
export interface AuthUser {
    id: string;
    email: string;
    username: string;
    name?: string;
    organizationId?: string;
    roles: string[];
    scopes: string[];
}
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}
export interface AuthResult {
    success: boolean;
    user?: AuthUser;
    tokens?: AuthTokens;
    error?: string;
}
export interface LoginInitResult {
    authUrl?: string;
    requiresRedirect: boolean;
    error?: string;
}
/**
 * Common interface for authentication providers
 * Both OAuth and Mock auth must implement this interface
 */
export interface IAuthProvider {
    /**
     * Initialize login flow
     * For OAuth: generates auth URL for redirect
     * For Mock: returns success without redirect
     */
    initiateLogin(sessionData?: any): Promise<LoginInitResult>;
    /**
     * Complete login flow
     * For OAuth: exchanges code for tokens and fetches user info
     * For Mock: validates mock credentials and creates session
     */
    completeLogin(params: any): Promise<AuthResult>;
    /**
     * Validate an access token
     * For OAuth: verifies token with OAuth server
     * For Mock: validates mock token format
     */
    validateToken(token: string): Promise<AuthUser | null>;
    /**
     * Refresh an access token
     * For OAuth: uses refresh token to get new access token
     * For Mock: generates new mock token
     */
    refreshToken(refreshToken: string): Promise<AuthTokens | null>;
    /**
     * Logout user
     * For OAuth: revokes tokens on OAuth server
     * For Mock: marks token as invalid
     */
    logout(tokens: AuthTokens): Promise<boolean>;
    /**
     * Provider name
     */
    readonly name: string;
}
//# sourceMappingURL=types.d.ts.map
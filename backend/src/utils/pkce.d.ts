/**
 * Generate a random code verifier for PKCE
 */
export declare function generateCodeVerifier(): string;
/**
 * Generate code challenge from verifier using S256 method
 */
export declare function generateCodeChallenge(verifier: string): string;
/**
 * Generate a random state parameter for CSRF protection
 */
export declare function generateState(): string;
//# sourceMappingURL=pkce.d.ts.map
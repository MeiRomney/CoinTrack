import crypto from "crypto";
/**
 * Generate a random code verifier for PKCE
 */
export function generateCodeVerifier() {
    return crypto.randomBytes(32).toString("base64url");
}
/**
 * Generate code challenge from verifier using S256 method
 */
export function generateCodeChallenge(verifier) {
    return crypto.createHash("sha256").update(verifier).digest("base64url");
}
/**
 * Generate a random state parameter for CSRF protection
 */
export function generateState() {
    return crypto.randomBytes(16).toString("base64url");
}
//# sourceMappingURL=pkce.js.map
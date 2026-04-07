import axios from "axios";
import { generateCodeVerifier, generateCodeChallenge, generateState, } from "../utils/pkce.js";
import { getLogger } from "../utils/logger.js";
import config from "../config.js";
const logger = getLogger();
/**
 * OAuth 2.0 Authentication Provider
 *
 * Implements IAuthProvider using OAuth 2.0 PKCE flow.
 * Handles secure authentication with external OAuth server.
 */
export class OAuthProvider {
    name = "oauth";
    clientId;
    clientSecret;
    serverUrl;
    callbackUrl;
    scopes;
    constructor() {
        this.clientId = config.oauth.clientId;
        this.clientSecret = config.oauth.clientSecret;
        this.serverUrl = config.oauth.serverUrl;
        this.callbackUrl = config.oauth.callbackUrl;
        this.scopes = config.oauth.appScopes;
    }
    /**
     * Initialize OAuth login - generates authorization URL
     */
    async initiateLogin(sessionData) {
        try {
            // Generate PKCE parameters
            const codeVerifier = sessionData?.codeVerifier || generateCodeVerifier();
            const codeChallenge = generateCodeChallenge(codeVerifier);
            const state = sessionData?.state || generateState();
            // Build authorization URL
            const authUrl = new URL(`${this.serverUrl}/oauth2/authorize`);
            authUrl.searchParams.append("response_type", "code");
            authUrl.searchParams.append("client_id", this.clientId);
            authUrl.searchParams.append("redirect_uri", this.callbackUrl);
            authUrl.searchParams.append("scope", this.scopes.join(" "));
            authUrl.searchParams.append("state", state);
            authUrl.searchParams.append("code_challenge", codeChallenge);
            authUrl.searchParams.append("code_challenge_method", "S256");
            logger.info("OAuth login initiated", {
                provider: this.name,
                state: state.substring(0, 8) + "...",
            });
            return {
                authUrl: authUrl.toString(),
                requiresRedirect: true,
            };
        }
        catch (error) {
            logger.error("Failed to initiate OAuth login:", error);
            return {
                requiresRedirect: false,
                error: "Failed to initialize OAuth login",
            };
        }
    }
    /**
     * Complete OAuth login - exchange code for tokens
     */
    async completeLogin(params) {
        try {
            // Verify state to prevent CSRF
            if (params.state !== params.expectedState) {
                logger.warn("OAuth state mismatch", {
                    received: params.state,
                    expected: params.expectedState,
                });
                return {
                    success: false,
                    error: "Invalid state parameter",
                };
            }
            // Exchange code for tokens
            const tokenResponse = await axios.post(`${this.serverUrl}/oauth2/token`, new URLSearchParams({
                grant_type: "authorization_code",
                code: params.code,
                redirect_uri: this.callbackUrl,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code_verifier: params.codeVerifier,
            }).toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            const { access_token, refresh_token, expires_in } = tokenResponse.data;
            // Fetch user information
            const user = await this.fetchUserInfo(access_token);
            if (!user) {
                return {
                    success: false,
                    error: "Failed to fetch user information",
                };
            }
            logger.info("OAuth login successful", {
                userId: user.id,
                provider: this.name,
            });
            return {
                success: true,
                user,
                tokens: {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresIn: expires_in,
                },
            };
        }
        catch (error) {
            logger.error("OAuth login failed:", error);
            return {
                success: false,
                error: "Authentication failed",
            };
        }
    }
    /**
     * Validate OAuth token by fetching user info
     */
    async validateToken(token) {
        return this.fetchUserInfo(token);
    }
    /**
     * Refresh OAuth access token
     */
    async refreshToken(refreshToken) {
        try {
            const response = await axios.post(`${this.serverUrl}/oauth2/token`, new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }).toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            const { access_token, refresh_token, expires_in } = response.data;
            logger.info("OAuth token refreshed successfully");
            return {
                accessToken: access_token,
                refreshToken: refresh_token || refreshToken,
                expiresIn: expires_in,
            };
        }
        catch (error) {
            logger.error("Token refresh failed:", error);
            return null;
        }
    }
    /**
     * Logout - revoke OAuth tokens
     */
    async logout(tokens) {
        try {
            // Revoke access token
            await axios.post(`${this.serverUrl}/oauth2/revoke`, new URLSearchParams({
                token: tokens.accessToken,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }).toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            // Revoke refresh token if exists
            if (tokens.refreshToken) {
                await axios.post(`${this.serverUrl}/oauth2/revoke`, new URLSearchParams({
                    token: tokens.refreshToken,
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                }).toString(), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
            }
            logger.info("OAuth logout successful");
            return true;
        }
        catch (error) {
            logger.error("OAuth logout failed:", error);
            // Return true anyway - local session should be cleared
            return true;
        }
    }
    /**
     * Fetch user information from OAuth server
     */
    async fetchUserInfo(accessToken) {
        try {
            const response = await axios.get(`${this.serverUrl}/oauth2/userinfo`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = response.data;
            // Map OAuth user data to our AuthUser format
            return {
                id: data.sub || data.id,
                email: data.email,
                username: data.preferred_username || data.username || data.email,
                name: data.name ||
                    `${data.given_name || ""} ${data.family_name || ""}`.trim(),
                organizationId: data.organization_id || data.org_id,
                roles: data.roles || [],
                scopes: data.scope?.split(" ") || [],
            };
        }
        catch (error) {
            logger.error("Failed to fetch user info:", error);
            return null;
        }
    }
}
//# sourceMappingURL=oauth-provider.js.map
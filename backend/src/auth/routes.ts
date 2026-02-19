import { Router } from "express";
import type { Request, Response } from "express";
import { getLogger } from "../utils/logger.ts";
import { getAuthProvider, isMockAuthEnabled } from "./provider-factory.ts";
import { MockAuthProvider } from "./mock-provider.ts";

interface SessionData {
  codeVerifier?: string;
  state?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    name?: string;
    organizationId?: string;
    roles: string[];
    scopes: string[];
  };
}

// Extend session interface
declare global {
  namespace Express {
    interface Request {
      session: SessionData & {
        destroy(callback?: (err: Error | null) => void): void;
      };
      sessionID?: string;
    }
  }
}

const logger = getLogger();
const authRouter = Router();

// Middleware to ensure user is authenticated
export function ensureAuthenticated(req: Request, res: any, next: any): void {
  // Debug logging
  logger.info("ensureAuthenticated check", {
    hasAccessToken: !!req.session.accessToken,
    hasUser: !!req.session.user,
    sessionID: req.sessionID,
    sessionData: JSON.stringify(req.session),
  });

  if (req.session.accessToken && req.session.user) {
    return next();
  }

  logger.warn("Unauthenticated access attempt", {
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.get("User-Agent"),
  });

  res.status(401).json({
    error: "Unauthorized",
    message: "Authentication required",
    redirectTo: "/auth/login",
  });
}

// Middleware to ensure user has specific roles
export function ensureRole(requiredRoles: string | string[]) {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return (req: Request, res: any, next: any): void => {
    if (!req.session.accessToken || !req.session.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    const userRoles = req.session.user.roles || [];
    const hasRequiredRole = roles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      logger.warn("Insufficient permissions", {
        userId: req.session.user.id,
        userRoles,
        requiredRoles: roles,
        path: req.path,
      });

      return res.status(403).json({
        error: "Forbidden",
        message: "Insufficient permissions",
        requiredRoles: roles,
      });
    }

    next();
  };
}

// Middleware to ensure user has specific scopes
export function ensureScope(requiredScopes: string | string[]) {
  const scopes = Array.isArray(requiredScopes)
    ? requiredScopes
    : [requiredScopes];

  return (req: Request, res: any, next: any): void => {
    if (!req.session.accessToken || !req.session.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    const userScopes = req.session.user.scopes || [];
    const hasRequiredScope = scopes.some((scope) => userScopes.includes(scope));

    if (!hasRequiredScope) {
      logger.warn("Insufficient scope permissions", {
        userId: req.session.user.id,
        userScopes,
        requiredScopes: scopes,
        path: req.path,
      });

      return res.status(403).json({
        error: "Forbidden",
        message: "Insufficient scope permissions",
        requiredScopes: scopes,
      });
    }

    next();
  };
}

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints (OAuth or Mock)
 */

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Initiate authentication
 *     tags: [Authentication]
 *     description: Initiates auth flow (OAuth redirect or mock session)
 *     responses:
 *       200:
 *         description: Authentication initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     authUrl:
 *                       type: string
 *                     provider:
 *                       type: string
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     provider:
 *                       type: string
 *       500:
 *         description: Failed to initiate authentication
 *   post:
 *     summary: Complete mock authentication
 *     tags: [Authentication]
 *     description: Complete authentication with credentials (mock mode only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               userType:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                 message:
 *                   type: string
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Mock authentication is disabled
 *       500:
 *         description: Server error
 */
authRouter.get("/login", async (req: Request, res: Response): Promise<void> => {
  logger.info("Login initiated", {
    ip: req.ip,
    provider: getAuthProvider().name,
    sessionID: req.sessionID,
  });

  try {
    const provider = getAuthProvider();

    // Store PKCE parameters for OAuth
    const codeVerifier = Math.random().toString(36).substring(2, 15);
    const state = Math.random().toString(36).substring(2, 15);
    req.session.codeVerifier = codeVerifier;
    req.session.state = state;

    const result = await provider.initiateLogin({ codeVerifier, state });

    if (result.error) {
      res.status(500).json({
        error: "login_failed",
        message: result.error,
      });
      return;
    }

    if (result.requiresRedirect && result.authUrl) {
      // OAuth flow - return URL for redirect
      res.json({
        authUrl: result.authUrl,
        provider: provider.name,
      });
    } else {
      // Mock auth - no redirect needed
      res.json({
        message: "Use POST /auth/login with credentials",
        provider: provider.name,
      });
    }
  } catch (error: any) {
    logger.error("Login initiation failed:", error);
    res.status(500).json({
      error: "login_failed",
      message: "Failed to initiate authentication",
    });
  }
});

// Mock login endpoint (POST)
authRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    if (!isMockAuthEnabled()) {
      res.status(403).json({
        error: "forbidden",
        message: "Mock authentication is disabled",
      });
      return;
    }

    try {
      const provider = getAuthProvider() as MockAuthProvider;
      const { userId, userType, firstName, lastName } = req.body;

      const result = await provider.completeLogin({
        userId,
        userType,
        firstName,
        lastName,
      });

      if (!result.success || !result.user || !result.tokens) {
        res.status(401).json({
          error: "login_failed",
          message: result.error || "Authentication failed",
        });
        return;
      }

      // Store in session
      req.session.user = result.user;
      req.session.accessToken = result.tokens.accessToken;
      req.session.refreshToken = result.tokens.refreshToken;

      logger.info("Mock login successful", {
        userId: result.user.id,
        userType,
      });

      res.json({
        success: true,
        user: result.user,
        message: "Authentication successful",
      });
    } catch (error: any) {
      logger.error("Mock login failed:", error);
      res.status(500).json({
        error: "login_failed",
        message: "Authentication failed",
      });
    }
  },
);

/**
 * @swagger
 * /auth/callback:
 *   get:
 *     summary: OAuth callback endpoint
 *     tags: [Authentication]
 *     description: Handles OAuth provider callback
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: error
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to frontend with result
 */
authRouter.get(
  "/callback",
  async (req: Request, res: Response): Promise<void> => {
    const { code, state, error } = req.query;

    if (error) {
      logger.error("OAuth callback error:", { error });
      res.redirect("/?error=oauth_error");
      return;
    }

    if (!code || !state) {
      logger.error("Missing OAuth parameters");
      res.redirect("/?error=missing_parameters");
      return;
    }

    try {
      const provider = getAuthProvider();
      const result = await provider.completeLogin({
        code: code as string,
        state: state as string,
        codeVerifier: req.session.codeVerifier || "",
        expectedState: req.session.state || "",
      });

      if (!result.success || !result.user || !result.tokens) {
        logger.error("OAuth login failed:", {
          error: result.error || "Unknown error",
        });
        res.redirect("/?error=authentication_failed");
        return;
      }

      // Store in session
      req.session.user = result.user;
      req.session.accessToken = result.tokens.accessToken;
      req.session.refreshToken = result.tokens.refreshToken;

      // Clear PKCE parameters
      delete req.session.codeVerifier;
      delete req.session.state;

      logger.info("OAuth login successful", {
        userId: result.user.id,
      });

      res.redirect("/?login=success");
    } catch (error: any) {
      logger.error("OAuth callback error:", error);
      res.redirect("/?error=authentication_failed");
    }
  },
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     description: Returns current authenticated user information
 *     responses:
 *       200:
 *         description: User information or authentication status
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     authenticated:
 *                       type: boolean
 *                       example: false
 *                 - type: object
 *                   properties:
 *                     authenticated:
 *                       type: boolean
 *                       example: true
 *                     user:
 *                       type: object
 */
authRouter.get("/me", (req: Request, res: Response): void => {
  if (!req.session.user) {
    res.json({
      authenticated: false,
    });
    return;
  }

  res.json({
    authenticated: true,
    user: req.session.user,
  });
});

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Check authentication status
 *     tags: [Authentication]
 *     description: Check if user is authenticated
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   nullable: true
 *                 provider:
 *                   type: string
 */
authRouter.get("/status", (req: Request, res: Response): void => {
  res.json({
    authenticated: !!req.session.user,
    user: req.session.user || null,
    provider: getAuthProvider().name,
  });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Logout and clear session
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Logout failed
 */
authRouter.post(
  "/logout",
  async (req: Request, res: Response): Promise<void> => {
    if (req.session.accessToken && req.session.refreshToken) {
      try {
        const provider = getAuthProvider();
        await provider.logout({
          accessToken: req.session.accessToken,
          refreshToken: req.session.refreshToken,
        });
      } catch (error) {
        logger.error("Provider logout failed:", error as any);
      }
    }

    req.session.destroy((err: Error | null) => {
      if (err) {
        logger.error("Session destruction failed:", err);
        res.status(500).json({
          error: "logout_failed",
          message: "Failed to logout",
        });
        return;
      }

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  },
);

/**
 * Mock-specific endpoints
 */

/**
 * @swagger
 * /auth/mock/users:
 *   get:
 *     summary: List available users (mock only)
 *     tags: [Authentication]
 *     description: Returns list of users for mock authentication
 *     responses:
 *       200:
 *         description: List of available users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       403:
 *         description: Mock authentication is disabled
 *       500:
 *         description: Failed to fetch users
 */
authRouter.get(
  "/mock/users",
  async (req: Request, res: Response): Promise<void> => {
    if (!isMockAuthEnabled()) {
      res.status(403).json({
        error: "forbidden",
        message: "Mock authentication is disabled",
      });
      return;
    }

    try {
      const provider = getAuthProvider() as MockAuthProvider;
      const users = await provider.listUsers();

      res.json({
        users,
        total: users.length,
        provider: provider.name,
      });
    } catch (error: any) {
      logger.error("Failed to list users:", error);
      res.status(500).json({
        error: "server_error",
        message: "Failed to fetch users",
      });
    }
  },
);

export default authRouter;

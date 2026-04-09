import { Router } from "express";
import type { Request, Response } from "express";
import { getLogger } from "../utils/logger.js";
import { AccountService } from "../services/account-service.js";
import { ensureAuthenticated } from "../auth/routes.js";

const logger = getLogger();
export const accountRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: User account and profile management endpoints
 */

/**
 * @swagger
 * /api/account/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     profilePhotoUrl:
 *                       type: string
 *                     organizationId:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                     scopes:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
accountRouter.get(
  "/profile",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId || !req.session.user) {
        return res.status(401).json({
          success: false,
          error: "User ID not found in session",
        });
      }

      const user = req.session.user;
      const profile = AccountService.getProfile(userId) || {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.name?.split(" ")[0],
        lastName: user.name?.split(" ").slice(1).join(" "),
        organizationId: user.organizationId,
        roles: user.roles,
        scopes: user.scopes,
      };

      res.json({
        success: true,
        user: profile,
      });
    } catch (error) {
      logger.error("Failed to get profile", { error });
      res.status(500).json({
        success: false,
        error: "Failed to retrieve profile",
      });
    }
  },
);

/**
 * @swagger
 * /api/account/profile:
 *   put:
 *     summary: Update current user's profile
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               profilePhotoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid request
 */
accountRouter.put(
  "/profile",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User ID not found in session",
        });
      }

      const { firstName, lastName, profilePhotoUrl } = req.body;

      // Validate input
      if (firstName && typeof firstName !== "string") {
        return res.status(400).json({
          success: false,
          error: "firstName must be a string",
        });
      }

      if (lastName && typeof lastName !== "string") {
        return res.status(400).json({
          success: false,
          error: "lastName must be a string",
        });
      }

      if (profilePhotoUrl && typeof profilePhotoUrl !== "string") {
        return res.status(400).json({
          success: false,
          error: "profilePhotoUrl must be a string",
        });
      }

      const updatedProfile = AccountService.updateProfile(userId, {
        firstName,
        lastName,
        profilePhotoUrl,
      });

      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          error: "User profile not found",
        });
      }

      res.json({
        success: true,
        user: updatedProfile,
      });
    } catch (error) {
      logger.error("Failed to update profile", { error });
      res.status(500).json({
        success: false,
        error: "Failed to update profile",
      });
    }
  },
);

/**
 * @swagger
 * /api/account/preferences:
 *   get:
 *     summary: Get current user's preferences
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 preferences:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     theme:
 *                       type: string
 *                       enum: [light, dark]
 *                     language:
 *                       type: string
 *                     currency:
 *                       type: string
 *                     emailNotifications:
 *                       type: boolean
 *                     pushNotifications:
 *                       type: boolean
 *                     twoFactorEnabled:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 */
accountRouter.get(
  "/preferences",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User ID not found in session",
        });
      }

      const preferences = AccountService.getPreferences(userId);

      res.json({
        success: true,
        preferences,
      });
    } catch (error) {
      logger.error("Failed to get preferences", { error });
      res.status(500).json({
        success: false,
        error: "Failed to retrieve preferences",
      });
    }
  },
);

/**
 * @swagger
 * /api/account/preferences:
 *   put:
 *     summary: Update current user's preferences
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [light, dark]
 *               language:
 *                 type: string
 *               currency:
 *                 type: string
 *               emailNotifications:
 *                 type: boolean
 *               pushNotifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid preference value
 */
accountRouter.put(
  "/preferences",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User ID not found in session",
        });
      }

      const {
        theme,
        language,
        currency,
        emailNotifications,
        pushNotifications,
      } = req.body;

      // Validate theme
      if (theme && !AccountService.isValidTheme(theme)) {
        return res.status(400).json({
          success: false,
          error: "Invalid theme. Must be 'light' or 'dark'",
        });
      }

      // Validate language
      if (language && !AccountService.isValidLanguage(language)) {
        return res.status(400).json({
          success: false,
          error: "Invalid language. Supported: english, khmer, spanish, french",
        });
      }

      // Validate currency
      if (currency && !AccountService.isValidCurrency(currency)) {
        return res.status(400).json({
          success: false,
          error: "Invalid currency. Supported: usd, khr, eur, gbp",
        });
      }

      const updatedPreferences = AccountService.updatePreferences(userId, {
        theme,
        language,
        currency,
        emailNotifications,
        pushNotifications,
      });

      res.json({
        success: true,
        preferences: updatedPreferences,
      });
    } catch (error) {
      logger.error("Failed to update preferences", { error });
      res.status(500).json({
        success: false,
        error: "Failed to update preferences",
      });
    }
  },
);

/**
 * @swagger
 * /api/account/deactivate:
 *   post:
 *     summary: Deactivate user account
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deactivated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
accountRouter.post(
  "/deactivate",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User ID not found in session",
        });
      }

      const success = AccountService.deactivateAccount(userId);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: "User account not found",
        });
      }

      res.json({
        success: true,
        message: "Account deactivated successfully",
      });
    } catch (error) {
      logger.error("Failed to deactivate account", { error });
      res.status(500).json({
        success: false,
        error: "Failed to deactivate account",
      });
    }
  },
);

export default accountRouter;

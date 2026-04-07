import { Router } from "express";
import { ensureAuthenticated, ensureScope } from "../auth/routes.js";
const testRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Test
 *   description: Test endpoints for OAuth functionality
 */
/**
 * @swagger
 * /api/test/anonymous:
 *   get:
 *     summary: Anonymous API endpoint
 *     tags: [Test]
 *     description: Test endpoint accessible to everyone without authentication
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello World"
 */
testRouter.get("/anonymous", (req, res) => {
    res.json({ message: "Hello World" });
});
/**
 * @swagger
 * /api/test/authenticated:
 *   get:
 *     summary: Authenticated API endpoint
 *     tags: [Test]
 *     description: Test endpoint that requires authentication
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello John Doe!"
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *       401:
 *         description: Authentication required
 */
testRouter.get("/authenticated", ensureAuthenticated, (req, res) => {
    const user = req.session.user;
    res.json({
        message: `Hello ${user.name || user.username || user.email}!`,
        userId: user.id,
    });
});
/**
 * @swagger
 * /api/test/authorized:
 *   get:
 *     summary: Authorized API endpoint (requires specific scope)
 *     tags: [Test]
 *     description: Test endpoint that requires specific OAuth scope permission
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to the authorized zone!"
 *                 scope:
 *                   type: string
 *                   example: "profile"
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient scope permissions
 */
testRouter.get("/authorized", ensureAuthenticated, ensureScope(["profile"]), // Require profile scope
(req, res) => {
    const user = req.session.user;
    res.json({
        message: "Welcome to the authorized zone!",
        scope: "profile",
        userId: user.id,
    });
});
export default testRouter;
//# sourceMappingURL=test.js.map
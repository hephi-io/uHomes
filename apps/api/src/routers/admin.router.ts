import express from 'express';
import { AdminController } from '../cotrollers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';

const router = express.Router();
const controller = new AdminController();

// All routes here require Authentication AND Admin role
router.use(authenticate, isAdmin);

/**
 * @openapi
 * /api/admin/verify-agent/{userId}:
 *   patch:
 *     summary: Approve or Reject an Agent's NIN
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [verified, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/verify-agent/:userId', controller.verifyAgent.bind(controller));

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', controller.getAllUsers.bind(controller));

export default router;

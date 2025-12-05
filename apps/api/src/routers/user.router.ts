import express from 'express';
import { UserController } from '../cotrollers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
const controller = new UserController();

/**
 * @openapi
 * /api/user/dashboard/stats/agent:
 *   get:
 *     summary: Get agent dashboard statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProperties:
 *                       type: number
 *                       example: 20
 *                     availableRooms:
 *                       type: number
 *                       example: 3
 *                     pendingBookings:
 *                       type: number
 *                       example: 4
 *                     totalRevenue:
 *                       type: number
 *                       example: 2000000
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/dashboard/stats/agent',
  authenticate,
  controller.getAgentDashboardStats.bind(controller)
);

export default router;

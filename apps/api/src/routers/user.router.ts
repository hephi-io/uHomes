import express from 'express';
import { UserController } from '../cotrollers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadNINDocument } from '../config/multer';

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

/**
 * @openapi
 * /api/user/verify-nin:
 *   post:
 *     summary: Submit NIN verification with document upload
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nin
 *               - document
 *             properties:
 *               nin:
 *                 type: string
 *                 pattern: "^\\d{11}$"
 *                 example: "12345678901"
 *                 description: National Identification Number (11 digits)
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: National ID Card or Slip (PDF, JPG, JPEG, PNG, max 5MB)
 *     responses:
 *       200:
 *         description: NIN verification submitted successfully
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
 *                     message:
 *                       type: string
 *                       example: NIN verification submitted successfully. Your document is under review.
 *       400:
 *         description: Bad request (invalid NIN format, missing document, etc.)
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/verify-nin',
  authenticate,
  uploadNINDocument.single('document'),
  controller.verifyNIN.bind(controller)
);

/**
 * @openapi
 * /api/user/nin-verification-status:
 *   get:
 *     summary: Get NIN verification status for current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification status retrieved successfully
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
 *                     verificationStatus:
 *                       type: string
 *                       enum: [pending, verified, rejected]
 *                       example: pending
 *                     hasDocument:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/nin-verification-status',
  authenticate,
  controller.getNINVerificationStatus.bind(controller)
);

export default router;

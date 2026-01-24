import express from 'express';
import { UserController } from '../cotrollers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import { uploadNINDocument, upload } from '../config/multer';

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

/**
 * @openapi
 * /api/user/upload-profile-picture:
 *   post:
 *     summary: Upload profile picture
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
 *               - profilePicture
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture image (JPG, JPEG, PNG, max 5MB)
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
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
 *                     profilePicture:
 *                       type: string
 *                       example: https://res.cloudinary.com/example/image/upload/v1234567890/profile-pictures/abc123.jpg
 *       400:
 *         description: Bad request (missing file, invalid file type, etc.)
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/upload-profile-picture',
  authenticate,
  upload.single('profilePicture'),
  controller.uploadProfilePicture.bind(controller)
);

/**
 * @openapi
 * /api/user/payment-setup:
 *   put:
 *     summary: Update payment setup (bank information and invoice email)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "1418443089"
 *               accountName:
 *                 type: string
 *                 example: "Melodie Ezeani"
 *               bank:
 *                 type: string
 *                 example: "guaranty-trust"
 *               alternativeEmail:
 *                 type: string
 *                 format: email
 *                 example: "invoice@example.com"
 *     responses:
 *       200:
 *         description: Payment setup updated successfully
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
 *                     _id:
 *                       type: string
 *                     accountNumber:
 *                       type: string
 *                     accountName:
 *                       type: string
 *                     bank:
 *                       type: string
 *                     alternativeEmail:
 *                       type: string
 *       400:
 *         description: Bad request (invalid email format, etc.)
 *       401:
 *         description: Unauthorized
 */
router.put('/payment-setup', authenticate, controller.updatePaymentSetup.bind(controller));

/**
 * @openapi
 * /api/user/notification-preferences:
 *   get:
 *     summary: Get notification preferences for current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences retrieved successfully
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
 *                     notificationPreferences:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/notification-preferences',
  authenticate,
  controller.getNotificationPreferences.bind(controller)
);

/**
 * @openapi
 * /api/user/notification-preferences:
 *   put:
 *     summary: Update notification preferences for current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: object
 *                     properties:
 *                       payment:
 *                         type: boolean
 *                       booking:
 *                         type: boolean
 *                       systemUpdates:
 *                         type: boolean
 *                       reviewAlert:
 *                         type: boolean
 *                   inApp:
 *                     type: object
 *                     properties:
 *                       payment:
 *                         type: boolean
 *                       booking:
 *                         type: boolean
 *                       systemUpdates:
 *                         type: boolean
 *                       reviewAlert:
 *                         type: boolean
 *                   sms:
 *                     type: object
 *                     properties:
 *                       payment:
 *                         type: boolean
 *                       booking:
 *                         type: boolean
 *                       systemUpdates:
 *                         type: boolean
 *                       reviewAlert:
 *                         type: boolean
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/notification-preferences',
  authenticate,
  controller.updateNotificationPreferences.bind(controller)
);

/**
 * @openapi
 * /api/user/notification-preferences/reset:
 *   post:
 *     summary: Reset notification preferences to default values
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences reset successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/notification-preferences/reset',
  authenticate,
  controller.resetNotificationPreferences.bind(controller)
);

/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', authenticate, isAdmin, controller.deleteUser.bind(controller));

export default router;

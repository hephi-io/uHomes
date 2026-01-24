import express from 'express';
import { UserController } from '../cotrollers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createUserSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  getUserByIdSchema,
  updateUserSchema,
  deleteUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendResetTokenSchema,
  verifyAccountSchema,
  verifyUrlSchema,
} from '../validation/user.validation';

const router = express.Router();
const controller = new UserController();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - password
 *               - type
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               type:
 *                 type: string
 *                 enum: [student, agent, admin]
 *                 example: agent
 *                 description: User type. For students, university and yearOfStudy are required. For agents, NIN can be verified separately via the verify-nin endpoint.
 *               university:
 *                 type: string
 *                 example: University of Example
 *                 description: Required for student type
 *               yearOfStudy:
 *                 type: string
 *                 enum: [100, 200, 300, 400, 500]
 *                 example: "300"
 *                 description: Required for student type
 *               nin:
 *                 type: string
 *                 example: "12345678901"
 *                 pattern: "^\\d{11}$"
 *                 description: National Identification Number (optional for agent type - can be verified later via /api/user/verify-nin endpoint)
 *     parameters:
 *       - in: header
 *         name: admin-secret-key
 *         schema:
 *           type: string
 *         description: Required ONLY if type is 'admin'.
 *     responses:
 *       201:
 *         description: User registered successfully. Verification email sent.
 *       400:
 *         description: Bad request / validation failed
 */
router.post('/register', validate(createUserSchema), controller.register.bind(controller));

/**
 * @openapi
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email using the token sent via email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get(
  '/verify-email/:token',
  validate(verifyEmailSchema),
  controller.verifyEmail.bind(controller)
);

/**
 * @openapi
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend email verification code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *       404:
 *         description: User not found
 */
router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  controller.resendVerification.bind(controller)
);

/**
 * @openapi
 * /api/auth/verify-account:
 *   post:
 *     summary: Verify account using 6-digit code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 length: 6
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid code, expired, or max attempts exceeded
 */
router.post(
  '/verify-account',
  validate(verifyAccountSchema),
  controller.verifyAccount.bind(controller)
);

/**
 * @openapi
 * /api/auth/verify:
 *   get:
 *     summary: Verify account via signed URL
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Signed verification token from email
 *     responses:
 *       302:
 *         description: Redirects to frontend success or failure page
 */
router.get('/verify', validate(verifyUrlSchema), controller.verifyAccountViaUrl.bind(controller));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "MyPassword123"
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     userType:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *       400:
 *         description: Bad request / validation failed
 *       401:
 *         description: Incorrect email or password
 *       404:
 *         description: User not found
 */
router.post('/login', validate(loginSchema), controller.login.bind(controller));

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 userType:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, controller.getCurrentUser.bind(controller));

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, controller.logout.bind(controller));

/**
 * @openapi
 * /api/auth/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, validate(getUserByIdSchema), controller.getById.bind(controller));

/**
 * @openapi
 * /api/auth/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               university:
 *                 type: string
 *               yearOfStudy:
 *                 type: string
 *               nin:
 *                 type: string
 *                 pattern: "^\\d{11}$"
 *                 description: National Identification Number (must be exactly 11 digits)
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  authenticate,
  validate(updateUserSchema),
  controller.updateUser.bind(controller)
);

/**
 * @openapi
 * /api/auth/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticate, validate(deleteUserSchema), controller.delete.bind(controller));

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset OTP to user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset OTP sent successfully
 *       404:
 *         description: User not found
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  controller.forgotPassword.bind(controller)
);

/**
 * @swagger
 * /api/auth/reset-password/{otp}:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: otp
 *         required: true
 *         schema:
 *           type: string
 *           example: "123456"
 *         description: OTP received by email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request or invalid OTP
 *       404:
 *         description: User not found
 */
router.post(
  '/reset-password/:otp',
  validate(resetPasswordSchema),
  controller.resetPassword.bind(controller)
);

/**
 * @openapi
 * /api/auth/resend-reset-token:
 *   post:
 *     summary: Resend password reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset token resent successfully
 *       404:
 *         description: User not found
 */
router.post(
  '/resend-reset-token',
  validate(resendResetTokenSchema),
  controller.resendResetToken.bind(controller)
);

export default router;

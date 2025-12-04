import express from 'express';
import { AgentController } from '../cotrollers/agent.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createAgentSchema,
  loginSchema,
  getAgentByIdSchema,
  updateAgentSchema,
  deleteAgentSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validation/agent.validation';

const router = express.Router();
const controller = new AgentController();

/**
 * @openapi
 * /api/agent/register:
 *   post:
 *     summary: Register a new agent
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAgentRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/RegisterAgentResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/register',
  validate({ body: createAgentSchema }),
  controller.register.bind(controller)
);

/**
 * @openapi
 * /api/agent/verify-email/{token}:
 *   get:
 *     summary: Verify an agent's email using the token sent via email
 *     tags: [Agent]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/verify-email/:token', controller.verifyEmail.bind(controller));

/**
 * @openapi
 * /api/agent/resend-verification:
 *   post:
 *     summary: Resend email verification code
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: agent@example.com
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/resend-verification', controller.resendVerification.bind(controller));

/**
 * @swagger
 * /api/agent/login:
 *   post:
 *     summary: Login an agent
 *     tags: [Agent]
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
 *                 example: "agent@example.com"
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
 *                 agent:
 *                   $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Bad request / validation failed
 *       401:
 *         description: Incorrect email or password
 *       404:
 *         description: agent not found
 */
router.post('/login', validate({ body: loginSchema }), controller.login.bind(controller));

/**
 * @openapi
 * /api/agent:
 *   get:
 *     summary: Get all agents
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', authenticate, controller.getAll.bind(controller));

/**
 * @openapi
 * /api/agent/{id}:
 *   get:
 *     summary: Get an agent by ID
 *     tags: [Agent]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Agent retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/Agent'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:id',
  authenticate,
  validate({ body: getAgentByIdSchema }),
  controller.getById.bind(controller)
);

/**
 * @openapi
 * /api/agent/{id}:
 *   put:
 *     summary: Update an agent by ID
 *     tags: [Agent]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/Agent'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put(
  '/:id',
  authenticate,
  validate({ body: updateAgentSchema }),
  controller.updateAgent.bind(controller)
);

/**
 * @openapi
 * /api/agent/{id}:
 *   delete:
 *     summary: Delete an agent by ID
 *     tags: [Agent]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Agent deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Agent deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete(
  '/:id',
  authenticate,
  validate({ body: deleteAgentSchema }),
  controller.delete.bind(controller)
);

/**
 * @openapi
 * /api/agent/forgot-password:
 *   post:
 *     summary: Send password reset link to agent email
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ForgotPasswordSuccess'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  controller.forgotPassword.bind(controller)
);

/**
 * @swagger
 * /api/agent/reset-password/{otp}:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Agent]
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
  validate({ body: resetPasswordSchema, params: resetPasswordSchema }),
  controller.resetPassword.bind(controller)
);

/**
 * @openapi
 * /api/agent/resend-reset-token:
 *   post:
 *     summary: Resend password reset token
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: agent@example.com
 *     responses:
 *       200:
 *         description: Reset token resent successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post(
  '/resend-reset-token',
  validate({ body: resetPasswordSchema, params: resetPasswordSchema }),
  controller.resendResetToken.bind(controller)
);

export default router;

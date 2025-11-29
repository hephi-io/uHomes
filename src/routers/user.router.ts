import { Router } from 'express'
import {UserController} from '../cotrollers/user.controller'
import { validate } from '../middlewares/validate.middleware'
import { signupSchema, loginSchema } from '../validation/user.validation'
import { authenticate } from '../middlewares/auth.middleware'

const router: Router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: User signup
 *     description: Create a new user (Student, Agent, Admin), generate OTP, and send verification email
 *     tags:
 *       - Users
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
 *               - types
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: 07012345678
 *               password:
 *                 type: string
 *                 example: mypassword
 *               types:
 *                 type: string
 *                 enum: [Student, Agent, Admin]
 *                 example: Student
 *               university:
 *                 type: string
 *                 example: University of Lagos
 *                 description: Optional, only for Student role
 *               yearOfStudy:
 *                 type: string
 *                 example: 300
 *                 description: Optional, only for Student role
 *     responses:
 *       201:
 *         description: Signup successful, OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */
router.post('/signup', validate(signupSchema), userController.signup.bind(userController));

/**
 * @swagger
 * /api/users/verify-otp/{token}:
 *   get:
 *     summary: Verify email OTP
 *     description: Verify the OTP sent to the user’s email and mark the account as verified
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           example: '123456'
 *         description: The OTP token sent to the user
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */
router.get('/verify-otp/:token', userController.verifyOtp.bind(userController))

/**
 * @swagger
 * /api/users/resend-verify-otp:
 *   post:
 *     summary: Resend email verification OTP
 *     description: Sends a new OTP to the user’s email for verification
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 634fbdc9e4b0f1b7a9a1c123
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: User ID is required or user already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */
router.post('/resend-verify-otp', userController.resendVerifyOtp.bind(userController))

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Login a user using email and password, returns JWT token
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginPayload'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */
router.post('/login',validate(loginSchema), userController.login.bind(userController))


/**
 * @swagger
 * /api/users/forget-password:
 *   post:
 *     summary: Forgot password
 *     description: Sends a password reset OTP to the user’s email
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: OTP sent to email successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */ 
router.post('/forget-password', userController.forgetPassword.bind(userController))

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset a user’s password using OTP and new password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: '123456'
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */
router.post('/reset-password', userController.resetPassword.bind(userController))

/**
 * @swagger
 * /api/users/resend-reset-otp:
 *   post:
 *     summary: Resend OTP for resetting password
 *     description: Sends a new OTP to the user's email for password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: New OTP sent successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.post('/resend-reset-otp', userController.resendResetOtp.bind(userController))


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all registered users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       404:
 *         description: No users found
 */
router.get('/users', authenticate, userController.getAllUsers.bind(userController))


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a single user's details by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 634fbdc9e4b0f1b7a9a1c123
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: User not found
 */
router.get('/user/:id', authenticate, userController.getUserById.bind(userController))


/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Update user information (User or Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               fullName: John Updated
 *               phoneNumber: "09011223344"
 *               password: newpass123
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid ID or data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/user/:id', authenticate, userController.updateUser.bind(userController))


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User ID required
 *       404:
 *         description: User not found
 */
router.delete('/user/:id', authenticate, userController.deleteUser.bind(userController))


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 634fbdc9e4b0f1b7a9a1c123
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: User ID required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 */



export default router;

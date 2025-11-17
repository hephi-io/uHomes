import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { signupSchema, loginSchema } from '../validation/user.validation';

const router = Router();
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
 *               - role
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
 *               role:
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
router.get('/verify-otp/:token', userController.verifyOtp.bind(userController));

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
router.post('/login', validate(loginSchema), userController.login.bind(userController));

export default router;

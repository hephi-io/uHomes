import Express from 'express';
import { StudentController } from '../cotrollers/student.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createStudentSchema,
  loginSchema,
  getStudentByIdSchema,
  updateStudentSchema,
  deleteStudentSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validation/student.validation';

const router = Express.Router();
const Controller = new StudentController();

/**
 * @openapi
 * /api/students/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterStudentInput'
 *     responses:
 *       201:
 *         description: Student registered successfully. Verification email sent.
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post('/register', validate({body:createStudentSchema}), Controller.register.bind(Controller));

/**
 * @openapi
 * /api/student/verify-email/{otp}:
 *   get:
 *     summary: Verify a student email using the OTP sent via email
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: otp
 *         required: true
 *         schema:
 *           type: string
 *         description: OTP sent via email for verification
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
router.get('/verify-email/:otp', Controller.verifyEmail.bind(Controller));

/**
 * @openapi
 * /api/students/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: student@example.com
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/resend-verification', Controller.resendVerification.bind(Controller));

/**
 * @swagger
 * /api/student/login:
 *   post:
 *     summary: Login a student
 *     tags: [Students]
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
 *                 example: "student@example.com"
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
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request / validation failed
 *       401:
 *         description: Incorrect email or password
 *       404:
 *         description: Student not found
 */
router.post('/login', validate({body:loginSchema}), Controller.login.bind(Controller));

/**
 * @openapi
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of all students
 */
router.get('/', authenticate, Controller.getAll.bind(Controller));

/**
 * @openapi
 * /api/students/{id}:
 *   get:
 *     summary: Get a single student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:id',
  authenticate,
  validate({params:getStudentByIdSchema}),
  Controller.getById.bind(Controller)
);

/**
 * @openapi
 * /api/students/{id}:
 *   put:
 *     summary: Update student details
 *     tags: [Students]
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
 *             $ref: '#/components/schemas/UpdateStudentInput'
 *     responses:
 *       200:
 *         description: Updated student
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:id',
  authenticate,
  validate({params:updateStudentSchema}),
  Controller.updateStudent.bind(Controller)
);

/**
 * @openapi
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/:id',
  authenticate,
  validate({params:deleteStudentSchema}),
  Controller.delete.bind(Controller)
);

/**
 * @swagger
 * /api/student/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Students]
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
 *                 format: email
 *                 example: "student@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset link sent to your email."
 *       400:
 *         description: Bad request / validation failed
 *       404:
 *         description: Student not found
 */
router.post(
  '/forgot-password',
  validate({body:forgotPasswordSchema}),
  Controller.forgotPassword.bind(Controller)
);

/**
 * @swagger
 * /api/student/reset-password/{otp}:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Students]
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
  validate({params:resetPasswordSchema}),
  Controller.resetPassword.bind(Controller)
);

/**
 * @openapi
 * /api/students/resend-reset-token:
 *   post:
 *     summary: Resend password reset token
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: student@example.com
 *     responses:
 *       200:
 *         description: Reset token resent successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/resend-reset-token', Controller.resendResetToken.bind(Controller));

export default router;

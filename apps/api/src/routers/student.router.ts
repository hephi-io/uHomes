import Express from "express"
import { StudentController } from "../cotrollers/student.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validate.middleware"
import {
  createStudentSchema,
  loginSchema,
  getStudentByIdSchema,
  updateStudentSchema,
  deleteStudentSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validation/student.validation"

const router = Express.Router()
const Controller = new StudentController()

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
router.post("/register", validate(createStudentSchema), Controller.register.bind(Controller))

/**
 * @openapi
 * /api/students/verify-email/{token}:
 *   get:
 *     summary: Verify student email
 *     tags: [Students]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.get("/verify-email/:token", Controller.verifyEmail.bind(Controller))

/**
 * @openapi
 * /api/students/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     tags: [Authentication]
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
router.post("/resend-verification", Controller.resendVerification.bind(Controller))


/**
 * @openapi
 * /api/students/login:
 *   post:
 *     summary: Login as a student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post("/login", validate(loginSchema), Controller.login.bind(Controller))

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
router.get("/", authenticate, Controller.getAll.bind(Controller))

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
router.get("/:id", authenticate, validate(getStudentByIdSchema), Controller.getById.bind(Controller))

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
router.put("/:id", authenticate, validate(updateStudentSchema), Controller.updateStudent.bind(Controller))

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
router.delete("/:id", authenticate, validate(deleteStudentSchema), Controller.delete.bind(Controller))

/**
 * @openapi
 * /api/students/forgot-password:
 *   post:
 *     summary: Send password reset link to student email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post("/forgot-password", validate(forgotPasswordSchema), Controller.forgotPassword.bind(Controller))

/**
 * @openapi
 * /api/students/reset-password/{token}:
 *   post:
 *     summary: Reset student password using token
 *     tags: [Authentication]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post("/reset-password/:token", validate(resetPasswordSchema), Controller.resetPassword.bind(Controller))

/**
 * @openapi
 * /api/students/resend-reset-token:
 *   post:
 *     summary: Resend password reset token
 *     tags: [Authentication]
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
router.post("/resend-reset-token", Controller.resendResetToken.bind(Controller))

export default router

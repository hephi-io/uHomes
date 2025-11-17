/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "671f0ad2b65489c1a2345abc"
 *         fullName:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         university:
 *           type: string
 *           example: "University of Lagos"
 *         yearOfStudy:
 *           type: string
 *           example: "3"
 *         isVerified:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-25T14:48:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-27T10:21:00.000Z"
 *
 *     RegisterStudentInput:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phoneNumber
 *         - university
 *         - yearOfStudy
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         university:
 *           type: string
 *           example: "University of Lagos"
 *         yearOfStudy:
 *           type: string
 *           example: "300"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: "mySecurePassword123"
 *
 *     UpdateStudentInput:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "John Michael Doe"
 *         phoneNumber:
 *           type: string
 *           example: "+2348098765432"
 *         university:
 *           type: string
 *           example: "Covenant University"
 *         yearOfStudy:
 *           type: string
 *           example: "400"
 *
 *     responses:
 *       StudentUpdated:
 *         description: Student details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: true
 *               message:
 *                 type: string
 *                 example: "Student updated successfully"
 *               data:
 *                 $ref: '#/components/schemas/Student'
 *
 *
 *     VerifyEmailInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           example: "123456"
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           example: "myNewSecurePassword123"
 *         confirmPassword:
 *           type: string
 *           minLength: 8
 *           example: "myNewSecurePassword123"
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Unauthorized access"
 *
 *     NotFoundError:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Student not found"
 *
 *     BadRequestError:
 *       description: Invalid request data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Too many verification attempts. Please request a new code."
 *
 *     NotFoundError:
 *       description: Student not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Student not found"
 *
 *     ResetPasswordSuccess:
 *       description: Password reset successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: true
 *               message:
 *                 type: string
 *                 example: "Password reset successfully"
 *               email:
 *                 type: string
 *                 example: "student@example.com"
 *               time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-11T14:30:00.000Z"
 */

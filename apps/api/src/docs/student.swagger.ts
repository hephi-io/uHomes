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
 *           example: "Jane Doe"
 *         email:
 *           type: string
 *           example: "jane@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         university:
 *           type: string
 *           example: "University of Lagos"
 *         yearOfStudy:
 *           type: string
 *           example: "4"
 *         password:
 *           type: string
 *           example: "StrongPass123"
 *
 *     ResendVerificationRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: agent@example.com
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "jane@example.com"
 *         password:
 *           type: string
 *           example: "StrongPass123"
 *
 *     UpdateStudentInput:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "Jane A. Doe"
 *         email:
 *           type: string
 *           example: "jane.doe@updated.com"
 *         phoneNumber:
 *           type: string
 *           example: "+2348098765432"
 *         university:
 *           type: string
 *           example: "Covenant University"
 *         yearOfStudy:
 *           type: string
 *           example: "4"
 *
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           example: "jane@example.com"
 *
 *     ResetPasswordInput:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           example: "NewSecurePass123"
 *
 *     ResendResetTokenRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: agent@example.com
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
 *                 example: "Invalid email or password"
 */

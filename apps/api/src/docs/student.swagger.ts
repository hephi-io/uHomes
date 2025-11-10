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
 *           example: "300"
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
 *     VerifyEmailInput:
 *       type: object
 *       required:
 *         - otp
 *       properties:
 *         otp:
 *           type: string
 *           example: "123456"
 *
 *   responses:
 *     EmailVerifiedSuccess:
 *       description: Email verified successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Email verified successfully"
 *
 *     VerificationCodeError:
 *       description: Invalid or expired verification code
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Invalid or expired verification code"
 *
 *     TooManyAttemptsError:
 *       description: Too many verification attempts
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
 */

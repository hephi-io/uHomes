/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 634d4f3f1c4b8a1a8c0a1d2e
 *         fullName:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         phoneNumber:
 *           type: string
 *           example: 07012345678
 *         university:
 *           type: string
 *           example: University of Lagos
 *           description: Optional, only for Student role
 *         yearOfStudy:
 *           type: string
 *           example: 300
 *           description: Optional, only for Student role
 *         types:
 *           type: string
 *           enum: [Student, Agent, Admin]
 *           example: Student
 *         isVerified:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-11-17T10:15:30Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-11-17T10:15:30Z
 *
 *     Token:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: 634d4f3f1c4b8a1a8c0a1d2e
 *         types:
 *           type: string
 *           enum: [Student, Agent, Admin]
 *           example: Student
 *         typeOf:
 *           type: string
 *           enum: [emailVerification, login, resetPassword]
 *           example: emailVerification
 *         token:
 *           type: string
 *           example: 123456
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           example: 2025-11-17T10:20:30Z
 *
 *     LoginPayload:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: mypassword
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Login successful
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             type:
 *               type: string
 *               example: Student
 *             user:
 *               $ref: '#/components/schemas/User'
 *
 *     ResendVerifyOtpPayload:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           example: 634fbdc9e4b0f1b7a9a1c123
 *
 *     ForgetPasswordPayload:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           example: john@example.com
 *
 *     ResetPasswordPayload:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           example: '123456'
 *         newPassword:
 *           type: string
 *           example: newPassword123
 *
 *     DeleteByIdParams:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           example: 634fbdc9e4b0f1b7a9a1c123
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           nullable: true
 *           description: Optional payload or message returned
 *
 *     FailResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         data:
 *           type: object
 *           description: Error details or validation messages
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Internal server error
 *         code:
 *           type: string
 *           example: InternalServerError
 */

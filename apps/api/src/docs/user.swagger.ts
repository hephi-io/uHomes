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
 *     UserType:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: 634d4f3f1c4b8a1a8c0a1d2e
 *         role:
 *           type: string
 *           enum: [Student, Agent, Admin]
 *           example: Student
 *
 *     Token:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: 634d4f3f1c4b8a1a8c0a1d2e
 *         role:
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
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *
 *     FailResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         data:
 *           type: object
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

/**
 * @swagger
 * components:
 *   schemas:
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
 *             role:
 *               type: string
 *               example: Student
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 691b5f73d1ee837d3980b1aa
 *                 fullName:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *                 phoneNumber:
 *                   type: string
 *                   example: '7012345678'
 *                 isVerified:
 *                   type: boolean
 *                   example: true
 */

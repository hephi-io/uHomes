/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterAgentRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phoneNumber
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         password:
 *           type: string
 *           example: Password123!
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
 *     LoginAgentRequest:
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
 *           example: Password123!
 *
 *     Agent:
 *       type: object
 *       required:
 *         - _id
 *         - fullName
 *         - email
 *         - phoneNumber
 *         - role
 *         - isverified
 *       properties:
 *         _id:
 *           type: string
 *           example: 652df89ac5aefb6d92123456
 *         fullName:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         role:
 *           type: string
 *           example: agent
 *         isverified:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-17T18:16:31.818Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-17T18:17:45.390Z"
 *
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           example: myNewSecurePassword123
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
 *     SuccessMessage:
 *       description: Generic success message
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Operation completed successfully.
 *
 *     RegisterAgentResponse:
 *       description: Agent registered successfully, verification email sent
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Verification email sent. Please check your inbox.
 *               agentId:
 *                 type: string
 *                 example: "652df89ac5aefb6d92123456"
 *
 *     LoginAgentResponse:
 *       description: Login successful, JWT token returned
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               agent:
 *                 $ref: '#/components/schemas/Agent'
 *
 *     BadRequest:
 *       description: Bad request / validation failed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Invalid input data
 *
 *     Unauthorized:
 *       description: Authentication required or invalid token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Missing or invalid authentication token
 *
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Resource not found
 *
 *     ServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: An unexpected error occurred. Please try again later.
 *
 *     ForgotPasswordSuccess:
 *       description: Password reset link sent successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *               data:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Password reset link sent to your email.
 *
 *     ResetPasswordSuccess:
 *       description: Password reset successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *               data:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Password has been reset successfully.
 *
 *     ErrorResponse:
 *       description: Error response
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: error
 *               message:
 *                 type: string
 *                 example: Invalid or expired token
 *
 */

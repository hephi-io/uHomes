/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterUserRequest:
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
 *     LoginUserRequest:
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
 *     RegisterUserResponse:
 *       description: User registered successfully, verification email sent
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Verification email sent. Please check your inbox.
 *
 *     LoginUserResponse:
 *       description: Login successful, JWT token returned
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 652df89ac5aefb6d92123456
 *                   email:
 *                     type: string
 *                     example: john@example.com
 *                   fullName:
 *                     type: string
 *                     example: John Doe
 *
 *     ValidationErrorResponse:
 *       description: Input validation failed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["body","email"]
 *                     message:
 *                       type: string
 *                       example: "Invalid email address"
 *
 *     BadRequest:
 *       description: Bad request
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/responses/ValidationErrorResponse/content/application~1json/schema'
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
 */



/**
 * @openapi
 * components:
 *   schemas:
 *     User:
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
 *           example: 68f287ff92ffaecff353729c
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
 *           example: user
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
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
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
 *           example: user
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
 *     BadRequest:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Invalid input data
 *     Unauthorized:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Unauthorized, token missing
 *     NotFound:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: User not found
 */
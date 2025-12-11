/**
 * @swagger
 * components:
 *   schemas:
 *     Amenities:
 *       type: object
 *       properties:
 *         wifi:
 *           type: boolean
 *         kitchen:
 *           type: boolean
 *         security:
 *           type: boolean
 *         parking:
 *           type: boolean
 *         power24_7:
 *           type: boolean
 *         gym:
 *           type: boolean
 *     Image:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *         cloudinary_id:
 *           type: string
 *     Property:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         price:
 *           type: number
 *         roomType:
 *           type: string
 *           enum: [single, shared, self_contain]
 *         amenities:
 *           $ref: '#/components/schemas/Amenities'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Image'
 *         agentId:
 *           type: string
 *         isAvailable:
 *           type: boolean
 *         rating:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   responses:
 *     NotFound:
 *       description: Resource not found
 *     Unauthorized:
 *       description: Unauthorized access
 *     BadRequest:
 *       description: Invalid request parameters
 *
 */

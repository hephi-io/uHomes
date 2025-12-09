/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64a1c8f1e3b6a1a234567890
 *         userId:
 *           type: string
 *           example: 64a1c5f1e3b6a1a234567888
 *         type:
 *           type: string
 *           enum:
 *             - booking_created
 *             - booking_updated
 *             - booking_deleted
 *             - payment_created
 *             - payment_completed
 *             - payment_failed
 *             - payment_refunded
 *             - property_reviewed
 *             - account_updated
 *             - password_reset
 *           example: payment_completed
 *         title:
 *           type: string
 *           example: Payment Successful
 *         message:
 *           type: string
 *           example: Your payment of NGN 15000 was successful!
 *         read:
 *           type: boolean
 *           example: false
 *         relatedId:
 *           type: string
 *           description: ID of related entity (booking, payment, etc.)
 *           example: 64a1c8f1e3b6a1a234567891
 *         metadata:
 *           type: object
 *           example:
 *             amount: 15000
 *             currency: NGN
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-05T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-05T10:00:00.000Z"
 *
 *     NotificationListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             notifications:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 25
 *                 page:
 *                   type: number
 *                   example: 1
 *                 pages:
 *                   type: number
 *                   example: 3
 *                 limit:
 *                   type: number
 *                   example: 20
 *
 *     UnreadCountResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             unreadCount:
 *               type: number
 *               example: 5
 *
 *     MarkAllReadResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             count:
 *               type: number
 *               example: 10
 *               description: Number of notifications marked as read
 */

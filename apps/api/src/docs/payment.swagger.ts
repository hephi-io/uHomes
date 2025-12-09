/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentInput:
 *       type: object
 *       required:
 *         - amount
 *         - email
 *         - currency
 *         - paymentMethod
 *       properties:
 *         amount:
 *           type: number
 *           example: 15000
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         description:
 *           type: string
 *           example: Payment for a property
 *         currency:
 *           type: string
 *           example: NGN
 *         paymentMethod:
 *           type: string
 *           example: paystack
 *         bookingId:
 *           type: string
 *           description: Optional booking ID to link payment to a booking
 *           example: 64a1c8f1e3b6a1a234567890
 *
 *     Payment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64a1c8f1e3b6a1a234567890
 *         userId:
 *           type: string
 *           example: 64a1c5f1e3b6a1a234567888
 *         bookingId:
 *           type: string
 *           description: Optional booking ID if payment is linked to a booking
 *           example: 64a1c8f1e3b6a1a234567891
 *         user_email:
 *           type: string
 *           example: user@example.com
 *         amount:
 *           type: number
 *           example: 15000
 *         currency:
 *           type: string
 *           example: NGN
 *         paymentMethod:
 *           type: string
 *           example: paystack
 *         description:
 *           type: string
 *           example: Payment for subscription
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           example: pending
 *         reference:
 *           type: string
 *           example: "PSK_123456789"
 *         metadata:
 *           type: object
 *           example: {}
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-05T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-05T10:05:00.000Z"
 *
 *     UpdatePaymentStatus:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           example: completed
 *
 *     PaymentListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             payments:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
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
 *                   example: 10
 *
 */

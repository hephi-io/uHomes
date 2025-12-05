/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentInput:
 *       type: object
 *       required:
 *         - amount
 *         - email
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
 *
 *     Payment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64a1c8f1e3b6a1a234567890
 *         amount:
 *           type: number
 *           example: 15000
 *         email:
 *           type: string
 *           example: user@example.com
 *         description:
 *           type: string
 *           example: Payment for subscription
 *         currency:
 *           type: string
 *           example: NGN
 *         paymentMethod:
 *           type: string
 *           example: paystack
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           example: pending
 *         reference:
 *           type: string
 *           example: "PSK_123456789"
 *         authorization_url:
 *           type: string
 *           example: "https://paystack.com/pay/xyz123"
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
 *         message:
 *           type: string
 *           example: Payments retrieved successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Payment'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               example: 25
 *             page:
 *               type: number
 *               example: 1
 *             pages:
 *               type: number
 *               example: 3
 *             limit:
 *               type: number
 *               example: 10
 *
 */

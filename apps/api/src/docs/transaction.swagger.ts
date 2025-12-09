/**
 * @swagger
 * components:
 *   schemas:
 *     TransactionQuery:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: completed
 *         fromDate:
 *           type: string
 *           format: date
 *           example: "2025-12-01"
 *         toDate:
 *           type: string
 *           format: date
 *           example: "2025-12-05"
 *         minAmount:
 *           type: number
 *           example: 1000
 *         maxAmount:
 *           type: number
 *           example: 50000
 *         search:
 *           type: string
 *           example: "PSK_123456789"
 *         limit:
 *           type: number
 *           example: 10
 *         page:
 *           type: number
 *           example: 1
 *
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64a1d0f4e3b6a1a234567891
 *         paymentId:
 *           type: string
 *           description: ID of the linked payment
 *           example: 64a1c8f1e3b6a1a234567890
 *         userId:
 *           type: string
 *           example: 64a1c5f1e3b6a1a234567888
 *         reference:
 *           type: string
 *           example: PSK_123456789
 *         amount:
 *           type: number
 *           example: 15000
 *         currency:
 *           type: string
 *           example: NGN
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           example: completed
 *         description:
 *           type: string
 *           example: Payment for subscription
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
 *     TransactionsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Transactions fetched
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
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
 */

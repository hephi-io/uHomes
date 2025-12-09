import express from 'express';
import { PaymentController } from '../cotrollers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPaymentSchema, updatePaymentStatusSchema } from '../validation/payment.validation';

const router = express.Router();
const paymentController = new PaymentController();

/**
 * @swagger
 * /api/payment:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentInput'
 *     responses:
 *       201:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid request
 */
router.post(
  '/',
  authenticate,
  validate({ body: createPaymentSchema }),
  paymentController.createPayment.bind(paymentController)
);

/**
 * @swagger
 * /api/payment/{id}/verify:
 *   post:
 *     summary: Verify a payment after user completes checkout
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment verified and status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 */
router.post('/:id/verify', authenticate, paymentController.processPayment.bind(paymentController));

/**
 * @swagger
 * /api/payment/{id}/refund:
 *   post:
 *     summary: Refund a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment refunded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Refund failed
 *       404:
 *         description: Payment not found
 */
router.post('/:id/refund', authenticate, paymentController.refundPayment.bind(paymentController));

/**
 * @swagger
 * /api/payment:
 *   get:
 *     summary: List all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentListResponse'
 */
router.get('/', authenticate, paymentController.listPayments.bind(paymentController));

/**
 * @swagger
 * /api/payment/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 */
router.get('/:id', authenticate, paymentController.getPayment.bind(paymentController));

/**
 * @swagger
 * /api/payment/{id}/status:
 *   patch:
 *     summary: Update payment status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePaymentStatus'
 *     responses:
 *       200:
 *         description: Payment status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 */
router.patch(
  '/:id/status',
  authenticate,
  validate({ body: updatePaymentStatusSchema }),
  paymentController.updatePaymentStatus.bind(paymentController)
);

/**
 * @swagger
 * /api/payment/callback:
 *   get:
 *     summary: Paystack payment callback handler
 *     description: This endpoint handles Paystack redirects after payment completion. It verifies the payment and redirects to the frontend success page.
 *     tags: [Payments]
 *     parameters:
 *       - name: reference
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment reference from Paystack
 *     responses:
 *       302:
 *         description: Redirects to frontend success or error page
 */
router.get('/callback', paymentController.paymentCallback.bind(paymentController));

export default router;

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
 * /api/payment/verify-by-reference:
 *   post:
 *     summary: Verify a payment by reference and return booking data
 *     description: This endpoint verifies payment using payment reference and returns updated payment and booking data. Automatically updates booking status to confirmed on successful payment.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference
 *             properties:
 *               reference:
 *                 type: string
 *                 description: Payment reference from Paystack
 *     responses:
 *       200:
 *         description: Payment verified successfully with booking data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       $ref: '#/components/schemas/Payment'
 *                     booking:
 *                       $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid reference or payment not found
 *       404:
 *         description: Booking not found
 */
router.post(
  '/verify-by-reference',
  authenticate,
  paymentController.verifyPaymentByReference.bind(paymentController)
);

/**
 * @swagger
 * /api/payment/callback:
 *   get:
 *     summary: Paystack payment callback handler
 *     description: This endpoint handles Paystack redirects after payment completion. It redirects to the frontend callback page with the payment reference.
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
 *         description: Redirects to frontend callback page
 */
router.get('/callback', paymentController.paymentCallback.bind(paymentController));

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

export default router;

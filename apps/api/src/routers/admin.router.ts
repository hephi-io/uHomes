import express from 'express';
import { AdminController } from '../cotrollers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';

const router = express.Router();
const controller = new AdminController();

// All routes here require Authentication AND Admin role
router.use(authenticate, isAdmin);

/**
 * @openapi
 * /api/admin/verify-agent/{userId}:
 *   patch:
 *     summary: Approve or Reject an Agent's NIN
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [verified, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/verify-agent/:userId', controller.verifyAgent.bind(controller));

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all users (with filters and pagination)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [student, agent, admin]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', controller.getAllUsers.bind(controller));

/**
 * @openapi
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/dashboard/stats', controller.getDashboardStats.bind(controller));

/**
 * @openapi
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions (admin view)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of all transactions
 */
router.get('/transactions', controller.getAllTransactions.bind(controller));

/**
 * @openapi
 * /api/admin/transactions/{id}:
 *   get:
 *     summary: Get transaction details
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details
 */
router.get('/transactions/:id', controller.getTransactionDetails.bind(controller));

/**
 * @openapi
 * /api/admin/payments:
 *   get:
 *     summary: Get all payments (admin view)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of all payments
 */
router.get('/payments', controller.getAllPayments.bind(controller));

/**
 * @openapi
 * /api/admin/payments/stats:
 *   get:
 *     summary: Get payment statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Payment statistics
 */
router.get('/payments/stats', controller.getPaymentStats.bind(controller));

/**
 * @openapi
 * /api/admin/payments/{id}:
 *   get:
 *     summary: Get payment details
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment details
 */
router.get('/payments/:id', controller.getPaymentDetails.bind(controller));

/**
 * @openapi
 * /api/admin/properties:
 *   get:
 *     summary: Get all properties (admin view)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of all properties
 */
router.get('/properties', controller.getAllProperties.bind(controller));

/**
 * @openapi
 * /api/admin/properties/{id}/status:
 *   patch:
 *     summary: Update property status (approve/reject)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Property status updated
 */
router.patch('/properties/:id/status', controller.updatePropertyStatus.bind(controller));

/**
 * @openapi
 * /api/admin/agents/applications:
 *   get:
 *     summary: Get agent applications
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, verified, rejected]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of agent applications
 */
router.get('/agents/applications', controller.getAgentApplications.bind(controller));

export default router;

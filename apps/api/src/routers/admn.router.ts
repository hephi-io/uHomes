import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/roleBase.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  updateUserSchema,
  updatePropertySchema,
  updateBookingSchema,
} from '../validation/admin.validation';

const router = Router();
const controller = new AdminController();

router.use(authenticate);
router.use(authorizeRoles('Admin'));

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Dashboard stats retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               totalAgents: 10
 *               totalStudents: 50
 *               totalProperties: 20
 *               totalBookings: 15
 */
router.get('/stats', controller.getDashboardStats.bind(controller));

// Agents

/**
 * @openapi
 * /api/admin/agents:
 *   get:
 *     summary: Get all agents
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 */
router.get('/agents', controller.getAllAgents.bind(controller));

/**
 * @openapi
 * /api/admin/agents/{id}:
 *   get:
 *     summary: Get agent by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Agent found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       '404':
 *         description: Agent not found
 *
 *   put:
 *     summary: Update an agent
 *     tags:
 *       - Admin
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
 *             $ref: '#/components/schemas/Agent'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Agent updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       '404':
 *         description: Agent not found
 *
 *   delete:
 *     summary: Delete an agent
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Agent deleted
 *       '404':
 *         description: Agent not found
 */
router.get('/agents/:id', controller.getUserById.bind(controller));
router.put('/agents/:id', validate(updateUserSchema), controller.updateUser.bind(controller));
router.delete('/agents/:id', controller.deleteUser.bind(controller));

// Students

/**
 * @openapi
 * /api/admin/students:
 *   get:
 *     summary: Get all students
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/students', controller.getAllStudents.bind(controller));

/**
 * @openapi
 * /api/admin/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       '404':
 *         description: Student not found
 *
 *   put:
 *     summary: Update student
 *     tags:
 *       - Admin
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
 *             $ref: '#/components/schemas/Student'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Student updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       '404':
 *         description: Student not found
 *
 *   delete:
 *     summary: Delete student
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Student deleted
 *       '404':
 *         description: Student not found
 */
router.get('/students/:id', controller.getUserById.bind(controller));
router.put('/students/:id', validate(updateUserSchema), controller.updateUser.bind(controller));
router.delete('/students/:id', controller.deleteUser.bind(controller));

// Properties

/**
 * @openapi
 * /api/admin/properties:
 *   get:
 *     summary: Get all properties
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 */
router.get('/properties', controller.getAllProperties.bind(controller));

/**
 * @openapi
 * /api/admin/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Property found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       '404':
 *         description: Property not found
 *
 *   put:
 *     summary: Update property
 *     tags:
 *       - Admin
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
 *             $ref: '#/components/schemas/Property'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Property updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       '404':
 *         description: Property not found
 *
 *   delete:
 *     summary: Delete property
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Property deleted
 *       '404':
 *         description: Property not found
 */
router.get('/properties/:id', controller.getPropertyById.bind(controller));
router.put(
  '/properties/:id',
  validate(updatePropertySchema),
  controller.updateProperty.bind(controller)
);
router.delete('/properties/:id', controller.deleteProperty.bind(controller));

// Bookings

/**
 * @openapi
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
router.get('/bookings', controller.getAllBookings.bind(controller));

/**
 * @openapi
 * /api/admin/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Booking found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       '404':
 *         description: Booking not found
 *
 *   put:
 *     summary: Update booking status
 *     tags:
 *       - Admin
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
 *             $ref: '#/components/schemas/UpdateBooking'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Booking updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       '400':
 *         description: Invalid booking ID
 *       '404':
 *         description: Booking not found
 *
 *   delete:
 *     summary: Delete a booking
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Booking deleted
 *       '404':
 *         description: Booking not found
 */
router.get('/bookings/:id', controller.getBookingById.bind(controller));
router.put(
  '/bookings/:id',
  validate(updateBookingSchema),
  controller.updateBookingStatus.bind(controller)
);
router.delete('/bookings/:id', controller.deleteBooking.bind(controller));

export default router;

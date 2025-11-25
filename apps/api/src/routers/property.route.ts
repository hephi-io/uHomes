import express from 'express';
import { PropertyController } from '../cotrollers/property.controller';
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const controller = new PropertyController();

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management endpoints
 */

/**
 * @swagger
 * /api/property:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - location
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Luxury Apartment"
 *               description:
 *                 type: string
 *                 example: "Spacious 3-bedroom apartment in the city center"
 *               price:
 *                 type: number
 *                 example: 250000
 *               location:
 *                 type: string
 *                 example: "Downtown, New York"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, upload.array('images'), controller.createProperty.bind(controller));

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management endpoints
 */

/**
 * @swagger
 * /api/property/{id}:
 *   put:
 *     summary: Update a property by ID
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Luxury Apartment Updated"
 *               description:
 *                 type: string
 *                 example: "Updated 3-bedroom apartment in the city center"
 *               price:
 *                 type: number
 *                 example: 260000
 *               location:
 *                 type: string
 *                 example: "Downtown, New York"
 *               replaceImages:
 *                 type: boolean
 *                 description: Replace existing images if true
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.put(
  '/:id',
  authenticate,
  upload.array('images'),
  controller.updateProperty.bind(controller)
);

/**
 * @swagger
 * /api/property:
 *   get:
 *     summary: Get all properties with filtering and pagination
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of properties per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for title or description
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter (case-insensitive partial match)
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: string
 *         description: Comma-separated list of amenities to filter by
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: string
 *         description: Filter by agent ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, price, rating]
 *           default: createdAt
 *         description: Sort field (createdAt, price, rating)
 *     responses:
 *       200:
 *         description: Paginated list of properties
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
 *                     message:
 *                       type: string
 *                       example: Properties fetched successfully
 *                     properties:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Property'
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 */
router.get('/', controller.getAllProperties.bind(controller));

/**
 * @swagger
 * /api/property/agent:
 *   get:
 *     summary: Get properties for the authenticated agent with pagination
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of properties per page
 *     responses:
 *       200:
 *         description: Paginated list of properties for the agent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agent properties fetched successfully
 *                 properties:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/agent', authenticate, controller.getPropertiesByAgent.bind(controller));

/**
 * @swagger
 * /api/property/saved:
 *   get:
 *     summary: Get saved properties for authenticated student
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of properties per page
 *     responses:
 *       200:
 *         description: Saved properties fetched successfully
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
 *                     message:
 *                       type: string
 *                       example: Saved properties fetched successfully
 *                     properties:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Property'
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/saved', authenticate, controller.getSavedProperties.bind(controller));

/**
 * @swagger
 * /api/property/{id}/save:
 *   post:
 *     summary: Save a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID to save
 *     responses:
 *       200:
 *         description: Property saved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.post('/:id/save', authenticate, controller.saveProperty.bind(controller));

/**
 * @swagger
 * /api/property/{id}/save:
 *   delete:
 *     summary: Unsave a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID to unsave
 *     responses:
 *       200:
 *         description: Property unsaved successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id/save', authenticate, controller.unsaveProperty.bind(controller));

/**
 * @swagger
 * /api/property/{id}:
 *   get:
 *     summary: Get a single property by its ID
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the property to retrieve
 *     responses:
 *       200:
 *         description: Property found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.get('/:id', authenticate, controller.getPropertyById.bind(controller));

/**
 * @swagger
 * /api/property/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.delete('/:id', authenticate, controller.deleteProperty.bind(controller));

/**
 * @swagger
 * /api/property/{id}/image:
 *   delete:
 *     summary: Delete a single image from a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property or image not found
 */
router.delete('/:id/image', authenticate, controller.deleteSingleImage.bind(controller));

export default router;

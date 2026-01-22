import express from 'express';
import { PropertyController } from '../cotrollers/property.controller';
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware';
import reviewRouter from './review.router';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const controller = new PropertyController();

// Mount review routes before :id routes to avoid conflicts
router.use('/', reviewRouter);

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
 *               - location
 *               - price
 *               - roomType
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *                 example: Modern School Hostel
 *               description:
 *                 type: string
 *                 example: A secure and clean student hostel
 *               location:
 *                 type: string
 *                 example: University of Lagos
 *               price:
 *                 type: number
 *                 example: 150000
 *               roomType:
 *                 type: string
 *                 enum: [single, shared, self_contain]
 *                 example: single
 *               amenities:
 *                 $ref: '#/components/schemas/Amenities'
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 10 images
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', authenticate, upload.array('images'), controller.createProperty.bind(controller));

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
 *                 example: Luxury Apartment Updated
 *               description:
 *                 type: string
 *                 example: Updated 3-bedroom apartment in the city center
 *               location:
 *                 type: string
 *                 example: Downtown, New York
 *               price:
 *                 type: number
 *                 example: 260000
 *               roomType:
 *                 type: string
 *                 enum: [single, shared, self_contain]
 *                 example: shared
 *               amenities:
 *                 $ref: '#/components/schemas/Amenities'
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
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
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
 *     summary: Get saved properties for the authenticated student
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
 *       404:
 *         description: Property not found
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
 *     summary: Delete a property (Owner or Admin)
 *     description: Deletes a property. Agents can only delete their own properties. Admins can delete any property (e.g., to remove bad listings).
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
 *       403:
 *         description: Forbidden (Not owner or admin)
 *       404:
 *         description: Property not found
 */
router.delete('/:id', authenticate, controller.deleteProperty.bind(controller));

/**
 * @swagger
 * /api/property/{id}/image/{cloudinaryId}:
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
 *       - in: path
 *         name: cloudinaryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cloudinary ID of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property or image not found
 */
router.delete(
  '/:id/image/:cloudinaryId',
  authenticate,
  controller.deleteSingleImage.bind(controller)
);

export default router;

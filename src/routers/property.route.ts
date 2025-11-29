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
 * api/property:
 *   post:
 *     summary: Create a new property
 *     tags:
 *       - Properties
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
 *               - pricePerSemester
 *               - roomsAvailable
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *                 example: Modern School Hostel
 *               location:
 *                 type: string
 *                 example: University of Lagos
 *               pricePerSemester:
 *                 type: number
 *                 example: 150000
 *               description:
 *                 type: string
 *                 example: A secure and clean student hostel
 *               roomTypes:
 *                 type: object
 *                 properties:
 *                   single:
 *                     type: object
 *                     properties:
 *                       price:
 *                         type: number
 *                         example: 150000
 *                   shared:
 *                     type: object
 *                     properties:
 *                       price:
 *                         type: number
 *                         example: 90000
 *                   selfContain:
 *                     type: object
 *                     properties:
 *                       price:
 *                         type: number
 *                         example: 180000
 *               roomsAvailable:
 *                 type: number
 *                 example: 12
 *               amenities:
 *                 type: object
 *                 properties:
 *                   wifi:
 *                     type: boolean
 *                   kitchen:
 *                     type: boolean
 *                   security:
 *                     type: boolean
 *                   parking:
 *                     type: boolean
 *                   power24_7:
 *                     type: boolean
 *                   gym:
 *                     type: boolean
 *                 example:
 *                   wifi: true
 *                   kitchen: true
 *                   security: true
 *                   parking: false
 *                   power24_7: true
 *                   gym: false
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 10 images
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, upload.array('images'), controller.createProperty.bind(controller));

/**
 * @swagger
 * /property/{id}:
 *   put:
 *     summary: Update an existing property
 *     tags:
 *       - Properties
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
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               pricePerSemester:
 *                 type: number
 *               roomsAvailable:
 *                 type: number
 *               roomTypes:
 *                 type: object
 *                 properties:
 *                   single:
 *                     type: object
 *                     properties:
 *                       price:
 *                         type: number
 *                   shared:
 *                     type: object
 *                     properties:
 *                       price:
 *                         type: number
 *                   selfContain:
 *                     type: object
 *                     properties:
 *                       price:
 *                         type: number
 *               amenities:
 *                 type: object
 *                 properties:
 *                   wifi:
 *                     type: boolean
 *                   kitchen:
 *                     type: boolean
 *                   security:
 *                     type: boolean
 *                   parking:
 *                     type: boolean
 *                   power24_7:
 *                     type: boolean
 *                   gym:
 *                     type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload additional images
 *     responses:
 *       200:
 *         description: Property updated successfully
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
 *     summary: Get all properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of properties
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
 * /property/image/{id}:
 *   delete:
 *     summary: Delete a single property image by cloudinaryId
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: cloudinaryId
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             cloudinaryId:
 *               type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Property or image not found
 */
router.delete('/image/:id', authenticate, controller.deleteSingleImage.bind(controller));

export default router;

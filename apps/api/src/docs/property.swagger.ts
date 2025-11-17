/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1b9e4a3f1c8a5b1234567
 *         title:
 *           type: string
 *           example: Modern Apartment
 *         description:
 *           type: string
 *           example: Spacious 2-bedroom apartment in downtown
 *         price:
 *           type: number
 *           example: 250000
 *         location:
 *           type: string
 *           example: Lagos, Nigeria
 *         agentId:
 *           type: array
 *           items:
 *             type: string
 *           example: ["64f1b9e4a3f1c8a5b1234568"]
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://res.cloudinary.com/demo/image/upload/v1695681234/sample.jpg
 *               cloudinary_id:
 *                 type: string
 *                 example: sample123
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   responses:
 *     NotFound:
 *       description: Resource not found
 *     Unauthorized:
 *       description: Unauthorized access
 *     BadRequest:
 *       description: Invalid request parameters
 *
 *   put:
 *     summary: Update a property
 *     tags: [Properties]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: string
 *               replaceImages:
 *                 type: boolean
 *                 description: If true, replaces old images
 *               files:
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

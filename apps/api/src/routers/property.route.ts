import express from 'express';
import { z } from 'zod';
import { PropertyController } from '../cotrollers/property.controller';
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware';
import {
  propertyResponseSchema,
  propertyListResponseSchema,
  paginatedPropertyResponseSchema,
  createPropertyRequestSchema,
  updatePropertyRequestSchema,
  getPropertyByIdParamsSchema,
  deletePropertyParamsSchema,
  getPropertiesByAgentQuerySchema,
} from '../validation/property.validation';
import { registry } from '../config/swagger';
import {
  badRequestResponseSchema,
  unauthorizedResponseSchema,
  notFoundResponseSchema,
} from '../validation/shared-responses';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const controller = new PropertyController();

registry.registerPath({
  method: 'post',
  path: '/api/property',
  summary: 'Create a new property',
  tags: ['Properties'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: createPropertyRequestSchema.extend({
            images: z.array(z.any()).optional(),
            replaceImages: z.boolean().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Property created successfully',
      content: {
        'application/json': {
          schema: propertyResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
  },
});

router.post('/', authenticate, upload.array('images'), controller.createProperty.bind(controller));

registry.registerPath({
  method: 'put',
  path: '/api/property/{id}',
  summary: 'Update a property by ID',
  tags: ['Properties'],
  security: [{ bearerAuth: [] }],
  request: {
    params: getPropertyByIdParamsSchema,
    body: {
      content: {
        'multipart/form-data': {
          schema: updatePropertyRequestSchema.extend({
            images: z.array(z.any()).optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Property updated successfully',
      content: {
        'application/json': {
          schema: propertyResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Property not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.put(
  '/:id',
  authenticate,
  upload.array('images'),
  controller.updateProperty.bind(controller)
);

registry.registerPath({
  method: 'get',
  path: '/api/property',
  summary: 'Get all properties',
  tags: ['Properties'],
  responses: {
    200: {
      description: 'List of properties',
      content: {
        'application/json': {
          schema: propertyListResponseSchema,
        },
      },
    },
  },
});

router.get('/', controller.getAllProperties.bind(controller));

registry.registerPath({
  method: 'get',
  path: '/api/property/agent',
  summary: 'Get properties for the authenticated agent with pagination',
  tags: ['Properties'],
  security: [{ bearerAuth: [] }],
  request: {
    query: getPropertiesByAgentQuerySchema,
  },
  responses: {
    200: {
      description: 'Paginated list of properties for the agent',
      content: {
        'application/json': {
          schema: paginatedPropertyResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.get('/agent', authenticate, controller.getPropertiesByAgent.bind(controller));

registry.registerPath({
  method: 'get',
  path: '/api/property/{id}',
  summary: 'Get a single property by its ID',
  tags: ['Properties'],
  security: [{ bearerAuth: [] }],
  request: {
    params: getPropertyByIdParamsSchema,
  },
  responses: {
    200: {
      description: 'Property found',
      content: {
        'application/json': {
          schema: propertyResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Property not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.get('/:id', authenticate, controller.getPropertyById.bind(controller));

registry.registerPath({
  method: 'delete',
  path: '/api/property/{id}',
  summary: 'Delete a property',
  tags: ['Properties'],
  security: [{ bearerAuth: [] }],
  request: {
    params: deletePropertyParamsSchema,
  },
  responses: {
    200: {
      description: 'Property deleted successfully',
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Property not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.delete('/:id', authenticate, controller.deleteProperty.bind(controller));

registry.registerPath({
  method: 'delete',
  path: '/api/property/{id}/image',
  summary: 'Delete a single image from a property',
  tags: ['Properties'],
  security: [{ bearerAuth: [] }],
  request: {
    params: getPropertyByIdParamsSchema,
  },
  responses: {
    200: {
      description: 'Image deleted successfully',
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Property or image not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.delete('/:id/image', authenticate, controller.deleteSingleImage.bind(controller));

export default router;

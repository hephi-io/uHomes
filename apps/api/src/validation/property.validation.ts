import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Response Schemas
export const propertyResponseSchema = z
  .object({
    _id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    price: z.number(),
    location: z.string(),
    images: z.array(
      z
        .object({
          url: z.string(),
          cloudinary_id: z.string(),
        })
        .openapi({ type: 'object' })
    ),
    amenities: z.array(z.string()).optional(),
    rating: z.number().optional(),
    isAvailable: z.boolean(),
    agentId: z.array(z.string()),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Property object',
    example: {
      _id: '64f1b9e4a3f1c8a5b1234567',
      title: 'Modern Apartment',
      description: 'Spacious 2-bedroom apartment in downtown',
      price: 250000,
      location: 'Lagos, Nigeria',
      images: [
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1695681234/sample.jpg',
          cloudinary_id: 'sample123',
        },
      ],
      amenities: ['WiFi', 'Parking'],
      rating: 4.5,
      isAvailable: true,
      agentId: ['64f1b9e4a3f1c8a5b1234568'],
      createdAt: '2025-10-17T18:16:31.818Z',
      updatedAt: '2025-10-17T18:17:45.390Z',
    },
  });

export const propertyListResponseSchema = z.array(propertyResponseSchema).openapi({
  type: 'array',
  description: 'List of properties',
});

export const paginatedPropertyResponseSchema = z
  .object({
    message: z.string(),
    properties: z.array(propertyResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  })
  .openapi({
    type: 'object',
    description: 'Paginated properties response',
    example: {
      message: 'Agent properties fetched successfully',
      properties: [
        {
          _id: '64f1b9e4a3f1c8a5b1234567',
          title: 'Modern Apartment',
          description: 'Spacious 2-bedroom apartment',
          price: 250000,
          location: 'Lagos, Nigeria',
          images: [],
          isAvailable: true,
          agentId: ['64f1b9e4a3f1c8a5b1234568'],
        },
      ],
      total: 25,
      page: 1,
      limit: 10,
    },
  });

// Request Schemas (for OpenAPI documentation)
export const createPropertyRequestSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    location: z.string().min(1, 'Location is required'),
  })
  .openapi({
    type: 'object',
    description: 'Create property request',
  });

export const updatePropertyRequestSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    location: z.string().min(1).optional(),
    replaceImages: z.boolean().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Update property request',
  });

export const getPropertyByIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid property ID format')
    .openapi({ param: { name: 'id', in: 'path', required: true } }),
});

export const deletePropertyParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid property ID format')
    .openapi({ param: { name: 'id', in: 'path', required: true } }),
});

export const getPropertiesByAgentQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(() => 1)
    .optional()
    .openapi({ param: { name: 'page', in: 'query' } }),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(() => 10)
    .optional()
    .openapi({ param: { name: 'limit', in: 'query' } }),
});

// Request Schemas (for validation middleware)
export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    location: z.string().min(1, 'Location is required'),
  }),
});

export const updatePropertySchema = z.object({
  params: getPropertyByIdParamsSchema,
  body: updatePropertyRequestSchema,
});

export const getPropertyByIdSchema = z.object({
  params: getPropertyByIdParamsSchema,
});

export const deletePropertySchema = z.object({
  params: deletePropertyParamsSchema,
});

export const getPropertiesByAgentSchema = z.object({
  query: getPropertiesByAgentQuerySchema,
});

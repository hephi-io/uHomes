import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

/**
 * Shared response schemas for common error responses
 * Used across all API endpoints for consistent error documentation
 */

export const badRequestResponseSchema = z
  .object({
    error: z.union([
      z.string(),
      z.array(
        z
          .object({
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string(),
          })
          .openapi({ type: 'object' })
      ),
    ]),
    message: z.string().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Bad request / validation failed',
    example: {
      error: 'Invalid input data',
    },
  });

export const unauthorizedResponseSchema = z
  .object({
    error: z.string().optional(),
    message: z.string().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Unauthorized access - Missing or invalid authentication token',
    example: {
      error: 'Missing or invalid authentication token',
    },
  });

export const notFoundResponseSchema = z
  .object({
    error: z.string().optional(),
    message: z.string().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Resource not found',
    example: {
      error: 'Resource not found',
    },
  });

export const serverErrorResponseSchema = z
  .object({
    error: z.string().optional(),
    message: z.string().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Internal server error',
    example: {
      error: 'An unexpected error occurred. Please try again later.',
    },
  });

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z
    .object({
      success: z.boolean(),
      message: z.string().optional(),
      data: dataSchema.optional(),
    })
    .openapi({
      type: 'object',
      description: 'Successful response',
    });

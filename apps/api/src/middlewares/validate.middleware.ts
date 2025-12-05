import { ZodSchema, ZodError, ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

type SchemaInput = ZodSchema | { body?: ZodSchema; params?: ZodSchema; query?: ZodSchema };

export const validate =
  (schemaOrWrapper: SchemaInput) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Handle object wrapper pattern: { body: schema, params: schema, query: schema }
      if (
        typeof schemaOrWrapper === 'object' &&
        !(schemaOrWrapper instanceof ZodObject) &&
        ('body' in schemaOrWrapper || 'params' in schemaOrWrapper || 'query' in schemaOrWrapper)
      ) {
        const wrapper = schemaOrWrapper as {
          body?: ZodSchema;
          params?: ZodSchema;
          query?: ZodSchema;
        };
        if (wrapper.body) wrapper.body.parse(req.body);
        if (wrapper.params) wrapper.params.parse(req.params);
        if (wrapper.query) wrapper.query.parse(req.query);
        next();
        return;
      }

      // Handle ZodSchema directly
      const schema = schemaOrWrapper as ZodSchema;

      // Check if schema is a ZodObject with body/params/query structure
      if (schema instanceof ZodObject) {
        const shape = schema.shape;
        const hasBody = 'body' in shape;
        const hasParams = 'params' in shape;
        const hasQuery = 'query' in shape;

        // If schema has structured properties, validate accordingly
        if (hasBody || hasParams || hasQuery) {
          const dataToValidate: Record<string, unknown> = {};
          if (hasBody) dataToValidate.body = req.body;
          if (hasParams) dataToValidate.params = req.params;
          if (hasQuery) dataToValidate.query = req.query;
          schema.parse(dataToValidate);
        } else {
          // Flat schema - default to validating body for backward compatibility
          schema.parse(req.body);
        }
      } else {
        // Non-object schema - default to validating body
        schema.parse(req.body);
      }
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          data: {
            validation_errors: err.issues.map((issue) => ({
              field: issue.path.join('.'),
              message: issue.message,
            })),
          },
        });
      }
      next(err);
    }
  };

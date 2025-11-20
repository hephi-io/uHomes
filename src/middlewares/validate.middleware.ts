import { ZodObject, ZodRawShape, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodObject<ZodRawShape>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return res.status(400).json({ validation_errors: errors });
      }
      next(err);
    }
  };

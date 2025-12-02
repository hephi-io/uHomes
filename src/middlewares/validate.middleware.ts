import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

type ValidationSchemas = {
  body?: ZodObject<any>;
  params?: ZodObject<any>;
  query?: ZodObject<any>;
};

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) schemas.body.parse(req.body);
      if (schemas.params) schemas.params.parse(req.params);
      if (schemas.query) schemas.query.parse(req.query);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: err.issues });
      }
      next(err);
    }
  };

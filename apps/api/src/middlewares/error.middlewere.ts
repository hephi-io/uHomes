import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(500, message);
    this.name = 'InternalServerError';
  }
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) =>
  res.status(statusCode).json({ status: 'success', data });

export const sendFail = <T>(res: Response, data: T, statusCode = 400) =>
  res.status(statusCode).json({ status: 'fail', data });

export const sendError = (res: Response, message: string, statusCode = 500, code?: string) => {
  const response: { status: 'error'; message: string; code?: string } = {
    status: 'error',
    message,
  };
  if (code) response.code = code;
  return res.status(statusCode).json(response);
};

const errorMiddleware = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // Log full error with stack and request context
  logger.error('Error handler caught:', {
    ...(err instanceof Error && { message: err.message, name: err.name, stack: err.stack }),
    ...(err instanceof AppError && { statusCode: err.statusCode }),
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (err instanceof AppError) {
    if (err.statusCode >= 400 && err.statusCode < 500) {
      return sendFail(res, { error: err.message }, err.statusCode);
    }
    return sendError(res, err.message, err.statusCode);
  }

  if (err instanceof ZodError) {
    const validationErrors = err.issues.map((issue: ZodIssue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return sendFail(res, { validation_errors: validationErrors }, 400);
  }

  return sendError(
    res,
    process.env.NODE_ENV === 'development' && err instanceof Error
      ? err.message
      : 'Internal server error',
    500,
    process.env.NODE_ENV === 'development' && err instanceof Error ? err.name : undefined
  );
};

export default errorMiddleware;

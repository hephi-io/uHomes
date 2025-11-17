import { Response } from 'express';

interface JSendSuccess<T> {
  status: 'success';
  data: T;
}

interface JSendFail<T> {
  status: 'fail';
  data: T;
}

interface JSendError<T> {
  status: 'error';
  message: string;
  code?: string;
  data?: T;
}

export class ResponseHelper {
  static success<T>(res: Response, data: T, statusCode: number = 200): Response {
    const response: JSendSuccess<T> = {
      status: 'success',
      data,
    };
    return res.status(statusCode).json(response);
  }

  static fail<T>(res: Response, data: T, statusCode: number = 400): Response {
    const response: JSendFail<any> = {
      status: 'fail',
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error<T = unknown>(
    res: Response,
    message: string,
    statusCode: number = 500,
    code?: string,
    data?: T
  ): Response {
    const response: JSendError<T> = {
      status: 'error',
      message,
    };

    if (code) response.code = code;
    if (data) response.data = data;

    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T): Response {
    return this.success(res, data, 201);
  }

  static badRequest<T>(res: Response, errors: T): Response {
    return this.fail(res, errors, 400);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.fail(res, { error: message }, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.fail(res, { error: message }, 403);
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.fail(res, { error: message }, 404);
  }

  static conflict(res: Response, message: string): Response {
    return this.fail(res, { error: message }, 409);
  }

  static validationError(
    res: Response,
    errors: { path?: string[]; message: string; field?: string }[]
  ): Response {
    return this.fail(
      res,
      {
        validation_errors: errors.map((err) => ({
          field: err.path?.join('.') || err.field,
          message: err.message,
        })),
      },
      400
    );
  }
}

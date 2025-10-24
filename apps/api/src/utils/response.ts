import { Response } from "express";

interface JSendSuccess {
  status: "success";
  data: any;
}

interface JSendFail {
  status: "fail";
  data: any;
}

interface JSendError {
  status: "error";
  message: string;
  code?: string;
  data?: any;
}

export class ResponseHelper {
  static success(res: Response, data: any, statusCode: number = 200): Response {
    const response: JSendSuccess = {
      status: "success",
      data,
    };
    return res.status(statusCode).json(response);
  }

  static fail(res: Response, data: any, statusCode: number = 400): Response {
    const response: JSendFail = {
      status: "fail",
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    code?: string,
    data?: any
  ): Response {
    const response: JSendError = {
      status: "error",
      message,
    };

    if (code) response.code = code;
    if (data) response.data = data;

    return res.status(statusCode).json(response);
  }

  static created(res: Response, data: any): Response {
    return this.success(res, data, 201);
  }

  static badRequest(res: Response, errors: any): Response {
    return this.fail(res, errors, 400);
  }

  static unauthorized(
    res: Response,
    message: string = "Unauthorized"
  ): Response {
    return this.fail(res, { error: message }, 401);
  }

  static forbidden(res: Response, message: string = "Forbidden"): Response {
    return this.fail(res, { error: message }, 403);
  }

  static notFound(
    res: Response,
    message: string = "Resource not found"
  ): Response {
    return this.fail(res, { error: message }, 404);
  }

  static conflict(res: Response, message: string): Response {
    return this.fail(res, { error: message }, 409);
  }

  static validationError(res: Response, errors: any[]): Response {
    return this.fail(
      res,
      {
        validation_errors: errors.map((err) => ({
          field: err.path?.join(".") || err.field,
          message: err.message,
        })),
      },
      400
    );
  }
}
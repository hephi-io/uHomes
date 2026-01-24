import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/response';

//Middleware to check if the authenticated user is an admin.
// Assumes 'authenticate' middleware has already run and populated req.user.

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return ResponseHelper.unauthorized(res, 'User not authenticated');
  }

  if (user.type !== 'admin') {
    return ResponseHelper.fail(res, { message: 'Access denied. Admins only.' }, 403);
  }

  next();
};

import { Request, Response, NextFunction } from 'express';

export const authorizeTypes = (...types: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !types.includes(user.types)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

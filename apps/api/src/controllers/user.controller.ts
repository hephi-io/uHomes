import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { ResponseHelper } from '../utils/response';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const result = await this.userService.signup(payload);
      if (!result) {
        return ResponseHelper.badRequest(res, { error: 'Signup failed' });
      }
      return ResponseHelper.created(res, {
        message: 'Signup successful, verification code sent',
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.params.token;
      if (!token) {
        return ResponseHelper.badRequest(res, { error: 'Otp is required' });
      }

      await this.userService.verifyOtp(token);

      return ResponseHelper.success(res, { message: 'Email verified successfully' });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.login(req.body);
      return ResponseHelper.success(res, {
        message: 'Login successful',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

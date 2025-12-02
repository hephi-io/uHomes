import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { ResponseHelper } from '../utils/response';

export class UserController {
  private userService = new UserService();

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phoneNumber, password, type, university, yearOfStudy } = req.body;

      const result = await this.userService.register({
        fullName,
        email,
        phoneNumber,
        password,
        type,
        university,
        yearOfStudy,
      });

      return ResponseHelper.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const result = await this.userService.verifyEmail(token);

      if (!result) {
        return ResponseHelper.fail(res, { message: 'Email verification failed' }, 400);
      }
      return ResponseHelper.success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.userService.resendVerification(email);
      if (!result) {
        return ResponseHelper.fail(res, { message: 'Email verification failed' }, 400);
      }
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code } = req.body;
      const result = await this.userService.verifyAccount(email, code);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async verifyAccountViaUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        return ResponseHelper.badRequest(res, { message: 'Missing verification token' });
      }

      const result = await this.userService.verifyAccountViaUrl(token);
      return ResponseHelper.success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      if (!result) {
        return ResponseHelper.fail(res, { message: 'Login failed' }, 404);
      }
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as { id: string } | undefined;
      if (!user || !user.id) {
        return ResponseHelper.unauthorized(res, 'User not authenticated');
      }

      const result = await this.userService.getCurrentUser(user.id);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return ResponseHelper.fail(res, 'User not found', 404);
      }
      return ResponseHelper.success(res, user);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId || userId !== req.params.id) {
        return ResponseHelper.forbidden(res, 'forbidden');
      }

      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      return ResponseHelper.success(res, updatedUser);
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        return ResponseHelper.badRequest(res, { message: 'Email is required' });
      }

      const result = await this.userService.forgotPassword(email);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp } = req.params;
      const { newPassword, confirmPassword } = req.body;

      if (!otp || !newPassword || !confirmPassword) {
        return ResponseHelper.badRequest(res, {
          message: 'OTP, new password, and confirm password are all required',
        });
      }

      const result = await this.userService.resetPassword(otp, newPassword, confirmPassword);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async resendResetToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.userService.resendResetToken(email);

      if (!result) {
        return ResponseHelper.fail(res, { message: 'Failed to resend token' });
      }

      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedUser = await this.userService.deleteUser(req.params.id);
      return ResponseHelper.success(res, deletedUser);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Since JWT is stateless, we just return success
      // This endpoint can be extended in the future for token blacklisting
      return ResponseHelper.success(res, { message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }
}

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

    async resendVerifyOtp(req: Request, res:Response, next: NextFunction) {
    try {
      const { userId } = req.body;

      if (!userId) return ResponseHelper.badRequest(res, { error: 'User ID is required' })
      

     await this.userService.resendVerifyOtp(userId)

      return ResponseHelper.success(res, { message: ' Otp resend successfully' })
    } catch (err) {
      next(err)
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

   async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) return ResponseHelper.badRequest(res, { error: 'Email is required' })

     await this.userService.forgotPassword(email);
      return ResponseHelper.success(res, { message: 'Password reset OTP sent to email' })
    } catch (err) {
      next(err)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return ResponseHelper.badRequest(res, { error: 'Token and new password are required' })
      }

     await this.userService.resetPassword(token, newPassword)
      return ResponseHelper.success(res, { message: 'password reset successfully' })
    } catch (err) {
      next(err)
    }
  }

   async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return ResponseHelper.badRequest(res, { error: 'User ID is required' })

      await this.userService.deleteById(id)
      return ResponseHelper.success(res, { message: 'user deleted successfuly' })
    } catch (err) {
      next(err)
    }
  }
}



  
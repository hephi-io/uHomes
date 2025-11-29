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

    async resendResetOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) return ResponseHelper.badRequest(res, { error: 'Email is required' });

      await this.userService.resendResetOtp(email);
      return ResponseHelper.success(res, { message: 'New OTP sent to your email.' });
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();
      return ResponseHelper.success(res, { message: 'Users retrieved successfully', users });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return ResponseHelper.badRequest(res, { error: 'User ID is required' });

      const user = await this.userService.getUserById(id);
      return ResponseHelper.success(res, { message: 'User retrieved successfully', user });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return ResponseHelper.badRequest(res, { error: 'User ID is required' });

      if (!req.user) return ResponseHelper.unauthorized(res);

      const data = req.body;
      const updatedUser = await this.userService.updateUser(id, data, { id: req.user.id, types: req.user.types });

      return ResponseHelper.success(res, { message: 'User updated successfully', user: updatedUser });
    } catch (err) {
      next(err);
    }
  }


  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return ResponseHelper.badRequest(res, { error: 'User ID is required' })

      if (!req.user) return ResponseHelper.unauthorized(res);

      await this.userService.deleteUser(id, {id: req.user.id, types: req.user.types})
      return ResponseHelper.success(res, { message: 'user deleted successfuly' })
    } catch (err) {
      next(err)
    }
  }
}



  

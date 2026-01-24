import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { ResponseHelper } from '../utils/response';

export class UserController {
  private userService = new UserService();

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phoneNumber, password, type, university, yearOfStudy, nin } =
        req.body;

      // Security Check: If trying to register as admin, verify the secret key
      if (type === 'admin') {
        const adminSecret = req.headers['admin-secret-key'];
        const validSecret = process.env.ADMIN_SECRET_KEY || 'uhomes_admin_secret_2026'; // Fallback for dev

        if (adminSecret !== validSecret) {
          return ResponseHelper.fail(
            res,
            { message: 'Unauthorized: Invalid admin secret key' },
            403
          );
        }
      }

      const result = await this.userService.register({
        fullName,
        email,
        phoneNumber,
        password,
        type,
        university,
        yearOfStudy,
        nin,
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

  async getAgentDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const agentId = req.user?.id;

      if (!agentId) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const stats = await this.userService.getAgentDashboardStats(agentId);
      return ResponseHelper.success(res, stats);
    } catch (err) {
      next(err);
    }
  }

  async verifyNIN(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const { nin } = req.body;
      const file = req.file;

      if (!nin) {
        return ResponseHelper.badRequest(res, { message: 'NIN is required' });
      }

      if (!file) {
        return ResponseHelper.badRequest(res, { message: 'National ID document is required' });
      }

      const result = await this.userService.verifyNIN(userId, nin, file);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getNINVerificationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const status = await this.userService.getNINVerificationStatus(userId);
      return ResponseHelper.success(res, status);
    } catch (err) {
      next(err);
    }
  }

  async uploadProfilePicture(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const file = req.file;
      if (!file) {
        return ResponseHelper.badRequest(res, { message: 'Profile picture is required' });
      }

      const result = await this.userService.uploadProfilePicture(userId, file);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async updatePaymentSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const { accountNumber, accountName, bank, alternativeEmail } = req.body;

      const result = await this.userService.updatePaymentSetup(userId, {
        accountNumber,
        accountName,
        bank,
        alternativeEmail,
      });

      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const result = await this.userService.getNotificationPreferences(userId);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async updateNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const { preferences } = req.body;

      const result = await this.userService.updateNotificationPreferences(userId, preferences);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async resetNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const result = await this.userService.resetNotificationPreferences(userId);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.userService.deleteUser(id);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}

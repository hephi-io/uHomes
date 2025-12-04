import { Request, Response, NextFunction } from 'express';
import { AgentService } from '../service/agent.service';
import { ResponseHelper } from '../utils/response';

export class AgentController {
  private agentService = new AgentService();

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phoneNumber, password } = req.body;
      const result = await this.agentService.register(fullName, email, phoneNumber, password);
      return ResponseHelper.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const result = await this.agentService.verifyEmail(token);

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
      const result = await this.agentService.resendVerification(email);
      if (!result) {
        return ResponseHelper.fail(res, { message: 'email verification failed' }, 400);
      }
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.agentService.login(email, password);
      if (!result) {
        return ResponseHelper.fail(res, { message: 'Login failed' }, 404);
      }
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const agents = await this.agentService.getAllAgents();
      return ResponseHelper.success(res, agents);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const agent = await this.agentService.getAgentById(req.params.id);
      if (!agent) {
        return ResponseHelper.fail(res, 'Agent not found', 404);
      }
      return ResponseHelper.success(res, agent);
    } catch (err) {
      next(err);
    }
  }

  async updateAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const agentId = req.user?.id;

      if (!agentId || agentId !== req.params.id) {
        return ResponseHelper.forbidden(res, 'forbidden');
      }

      const updatedAgent = await this.agentService.updateAgent(req.params.id, req.body);
      return ResponseHelper.success(res, updatedAgent);
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

      const result = await this.agentService.forgotPassword(email);
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

      const result = await this.agentService.resetPassword(otp, newPassword, confirmPassword);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async resendResetToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.agentService.resendResetOtp(email);

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
      const deletedAgent = await this.agentService.deleteAgent(req.params.id);
      return ResponseHelper.success(res, deletedAgent);
    } catch (err) {
      next(err);
    }
  }

  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const agentId = req.user?.id;

      if (!agentId) {
        return ResponseHelper.unauthorized(res, 'Unauthorized');
      }

      const stats = await this.agentService.getDashboardStats(agentId);
      return ResponseHelper.success(res, stats);
    } catch (err) {
      next(err);
    }
  }
}

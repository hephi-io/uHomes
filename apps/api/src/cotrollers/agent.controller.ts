import type { Request, Response, NextFunction } from "express";
import { AgentService } from "../service/agent.service"
import { ResponseHelper } from "../utils/response"
import mongoose from "mongoose"

export class AgentController {
  private agentService = new AgentService()
    

  async register (req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phoneNumber, password } = req.body;
      const result = await this.agentService.register(fullName, email, phoneNumber, password);
      return ResponseHelper.created(res, result)
    } catch (err) {
      next(err)
    }
  };

  async verifyEmail (req: Request, res: Response, next: NextFunction) {
    try {
      const { otp } = req.params;
      const result = await this.agentService.verifyEmail(otp)

      if (!result) {
      return ResponseHelper.fail(res, { message: "Email verification failed" }, 400)
    }
     return ResponseHelper.success(res, result)
    } catch (err: any) {
      next(err)
    }
  }

  async resendVerification (req: Request, res: Response, next: NextFunction)  {
    try {
      const { email } = req.body
      const result = await this.agentService.resendVerification(email)
      if(!result){
      return ResponseHelper.fail(res, { message: "email verification failed"}, 400)
      }
      return ResponseHelper.success(res, result)
    } catch (err: any) {
      next()
    }
  }

  async login (req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return ResponseHelper.badRequest(res, { message: "Email and password are required" })
      }
      const result = await this.agentService.login(email, password);
      return ResponseHelper.success(res, result)
    } catch (err) {
      next(err)
    }
  };

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const agents = await this.agentService.getAllAgents()
      return ResponseHelper.success(res, agents )
    } catch (err) {
      next(err)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    console.log("getById hit:", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ResponseHelper.fail(res, "Invalid ID format", 400)
    }

    const agent = await this.agentService.getAgentById(id)
      console.log("Agent found:", agent)
    if (!agent) {
      return ResponseHelper.fail(res, "Agent not found", 404)
    }

    return ResponseHelper.success(res, agent)
  } catch (err) {
    console.error("Controller error:", err)
    next(err)
  }
 }
 
  async updateAgent(req: Request, res: Response, next: NextFunction  ) {
    try {
      
      const agentId = (req as any).user?.id;

      if (!agentId || agentId !== req.params.id) {
        return ResponseHelper.forbidden(res, "forbidden");
      }

      const updatedAgent = await this.agentService.updateAgent(req.params.id, req.body)
      return ResponseHelper.success(res, updatedAgent)
    } catch (err: any) {
       next(err)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      console.log("delete hit:", id)

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ResponseHelper.fail(res, "Invalid ID format", 400)
      }

      const deletedAgent = await this.agentService.deleteAgent(id)

      console.log("Deleted agent:", deletedAgent)

      if (!deletedAgent) {
        return ResponseHelper.fail(res, "Agent not found", 404)
      }

      return ResponseHelper.success(res, deletedAgent)
    } catch (err) {
      console.error("delete error:", err)
      next(err)
    }
   }
  
 
  async forgotPassword(req: Request, res: Response, next: NextFunction  ) {
    try {
      const { email } = req.body;

      if (!email) {
        return ResponseHelper.badRequest(res, { message: "Email is required" });
      }

      const result = await this.agentService.forgotPassword(email);
      return ResponseHelper.success(res, result)
    } catch (err) {
      next(err)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params
      const { newPassword } = req.body

      if (!token || !newPassword) {
        return ResponseHelper.badRequest(res, {  message: "Token and new password are required"})
      }

      const result = await this.agentService.resetPassword(token, newPassword)
      return ResponseHelper.success(res, result)
    } catch (err) {
      next(err)
    }
  }

  async resendResetToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body
      const result = await this.agentService.resendResetToken(email)
    if(!result){
      return ResponseHelper.fail(res, { message:"Token and a new password are required" })
    }
    return ResponseHelper.success(res, result)
    } catch (err: any) {
      next(err)
    }
  }  
}

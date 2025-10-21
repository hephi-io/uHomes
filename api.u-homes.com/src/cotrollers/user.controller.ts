import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service"
import { ResponseHelper } from "../utils/response"

export class UserController {
    private userService = new UserService()
    

    register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullName, email, phoneNumber, password } = req.body;
      const result = await this.userService.register(fullName, email, phoneNumber, password);
      return ResponseHelper.created(res, result)
    } catch (err) {
      next(err)
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const result = await this.userService.verifyEmail(token);
     return ResponseHelper.success(res, result)
    } catch (err: any) {
      next(err)
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      return ResponseHelper.success(res, result)
    } catch (err) {
      next(err)
    }
  };

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers()
      return ResponseHelper.success(res, users )
    } catch (err) {
      next(err)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUserById(req.params.id)
      return ResponseHelper.success(res, user)
    } catch (err) {
       next(err)
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction  ) {
    try {
      
      const userId = (req as any).user?.id;
      if (!userId || userId !== req.params.id) {
        return ResponseHelper.forbidden(res, "forbidden");
      }
      const updatedUser = await this.userService.updateUser(req.params.id, req.body)
      return ResponseHelper.success(res, updatedUser)
    } catch (err: any) {
       next(err)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction ) {
      try {
      const deletedUser = await this.userService.deleteUser(req.params.id);

      return ResponseHelper.success(res, deletedUser)
    } catch (err) {
        next(err)
    }

  }

 
  async forgotPassword(req: Request, res: Response, next: NextFunction  ) {
    try {
      const { email } = req.body;

      if (!email) {
        return ResponseHelper.badRequest(res, { message: "Email is required" });
      }

      const result = await this.userService.forgotPassword(email);
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

      const result = await this.userService.resetPassword(token, newPassword)
      return ResponseHelper.success(res, result)
    } catch (err) {
      next(err)
    }
  }
    
}

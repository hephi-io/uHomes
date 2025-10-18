import { Request, Response } from "express";
import { UserService } from "../service/user.service"


export class UserController {
    private userService = new UserService()
    

    register = async (req: Request, res: Response) => {
    try {
      const { fullName, email, phoneNumber, password } = req.body;
      const result = await this.userService.register(fullName, email, phoneNumber, password);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const result = await this.userService.verifyEmail(token);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  async getAll(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers()
      res.json({ success: true, users })
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id)
      res.json({ success: true, user })
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message })
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      
      const userId = (req as any).user?.id;
      if (!userId || userId !== req.params.id) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const updatedUser = await this.userService.updateUser(req.params.id, req.body)
      res.json({ success: true, updatedUser })
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message })
    }
  }

  async delete(req: Request, res: Response) {
      try {
      const deletedUser = await this.userService.deleteUser(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (err: any) {
      res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }

  }
    
}

import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../service/admin.service';
import { ResponseHelper } from '../utils/response';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  // ----- Dashboard -----
  async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.adminService.getDashboardStats();
      return ResponseHelper.success(res, stats);
    } catch (err) {
      next(err);
    }
  }

  // ----- Users -----
  async getAllAgents(_req: Request, res: Response, next: NextFunction) {
    try {
      const agents = await this.adminService.getAllAgents();
      return ResponseHelper.success(res, agents);
    } catch (err) {
      next(err);
    }
  }

  async getAllStudents(_req: Request, res: Response, next: NextFunction) {
    try {
      const students = await this.adminService.getAllStudents();
      return ResponseHelper.success(res, students);
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.adminService.getUserById(req.params.id);
      return ResponseHelper.success(res, user);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await this.adminService.updateUser(req.params.id, req.body);
      return ResponseHelper.success(res, updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.adminService.deleteUser(req.params.id);
      return ResponseHelper.success(res, deleted);
    } catch (err) {
      next(err);
    }
  }

  // ----- Properties -----
  async getAllProperties(_req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await this.adminService.getAllProperties();
      return ResponseHelper.success(res, properties);
    } catch (err) {
      next(err);
    }
  }

  async getPropertyById(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await this.adminService.getPropertyById(req.params.id);
      return ResponseHelper.success(res, property);
    } catch (err) {
      next(err);
    }
  }

  async updateProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await this.adminService.updateProperty(req.params.id, req.body);
      return ResponseHelper.success(res, updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.adminService.deleteProperty(req.params.id);
      return ResponseHelper.success(res, deleted);
    } catch (err) {
      next(err);
    }
  }

  // ----- Bookings -----
  async getAllBookings(_req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await this.adminService.getAllBookings();
      return ResponseHelper.success(res, bookings);
    } catch (err) {
      next(err);
    }
  }

  async getBookingById(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await this.adminService.getBookingById(req.params.id);
      return ResponseHelper.success(res, booking);
    } catch (err) {
      next(err);
    }
  }

  async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await this.adminService.updateBookingStatus(req.params.id, req.body.status);
      return ResponseHelper.success(res, updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.adminService.deleteBooking(req.params.id);
      return ResponseHelper.success(res, deleted);
    } catch (err) {
      next(err);
    }
  }
}

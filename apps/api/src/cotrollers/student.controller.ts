import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../service/student.service';
import { ResponseHelper } from '../utils/response';

export class StudentController {
  private studentService = new StudentService();

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phoneNumber, university, yearOfStudy, password } = req.body;

      const result = await this.studentService.register(
        fullName,
        email,
        phoneNumber,
        university,
        yearOfStudy,
        password
      );

      return ResponseHelper.created(res, result);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const result = await this.studentService.verifyEmail(token);

      if (!result) {
        return ResponseHelper.fail(res, { message: 'Email verification failed' }, 400);
      }

      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }
  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.studentService.resendVerification(email);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.studentService.login(email, password);

      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await this.studentService.getAllStudents();
      return ResponseHelper.success(res, students);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await this.studentService.getStudentById(req.params.id);
      return ResponseHelper.success(res, student);
    } catch (error) {
      next(error);
    }
  }

  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.id;
      if (!studentId || studentId !== req.params.id) {
        return ResponseHelper.forbidden(res, 'forbidden');
      }
      const updatedAgent = await this.studentService.updateStudent(req.params.id, req.body);
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

      const result = await this.studentService.forgotPassword(email);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  // Reset password using OTP
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp } = req.params;
      const { newPassword, confirmPassword } = req.body;

      if (!otp || !newPassword || !confirmPassword) {
        return ResponseHelper.badRequest(res, {
          message: 'Email, OTP, new password, and confirm password are all required',
        });
      }

      const result = await this.studentService.resetPassword(otp, newPassword, confirmPassword);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  // Resend OTP
  async resendResetToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        return ResponseHelper.badRequest(res, { message: 'Email is required' });
      }

      const result = await this.studentService.resendResetToken(email);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.studentService.deleteStudent(id);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}

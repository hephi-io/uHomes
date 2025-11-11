import { NextFunction, Request, Response } from "express"
import studentDashboardService from "../service/studentDashBoard"

export class StudentDashboardController {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?._id || req.params.studentId
      const data = await studentDashboardService.getStudentStats(studentId)
      res.status(200).json({
        success: true,
        message: "Student dashboard data fetched successfully",
        data
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching student dashboard data",
        error: error.message
      })
    }
  }
}

export default new StudentDashboardController()

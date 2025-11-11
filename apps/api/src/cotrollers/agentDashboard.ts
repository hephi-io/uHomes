import { Request, Response } from "express"
import agentDashboardService from "../service/agentDashboard.service"

export class AgentDashboardController {
  async getDashboard(req: Request, res: Response) {
    try {
      const agentId = req.user?._id || req.params.agentId
      if (!agentId) {
        return res.status(400).json({
          success: false,
          message: "Agent ID is required"
        })
      }

      const data = await agentDashboardService.getDashboardData(agentId)

      res.status(200).json({
        success: true,
        message: "Agent dashboard data fetched successfully",
        data
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching agent dashboard data",
        error: error.message
      })
    }
  }
}

export default new AgentDashboardController()

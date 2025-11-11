import mongoose from "mongoose"
import Property from "../models/property.model"
import Booking from "../models/booking.model"

export class AgentDashboardService {
  async getDashboardData(agentId: string) {
    if (!agentId) throw new Error("agentId is required")

    const objectId = new mongoose.Types.ObjectId(agentId)

    const totalPropertiesPromise = Property.countDocuments({ agentId: objectId })

    const availableRoomsPromise = Property.aggregate([
      { $match: { agentId: objectId } },
      { $group: { _id: null, totalAvailable: { $sum: "$availableRooms" } } }
    ])

    const totalBookingsPromise = Booking.countDocuments({ agent: objectId })
    const activeBookingsPromise = Booking.countDocuments({
      agent: objectId,
      status: { $in: ["confirmed", "completed"] }
    })
    const pendingBookingsPromise = Booking.countDocuments({
      agent: objectId,
      status: "pending"
    })

    const totalRevenuePromise = Booking.aggregate([
      { $match: { agent: objectId, paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ])

    const recentPropertiesPromise = Property.find({ agentId: objectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title location price images createdAt")
      .lean()

    const recentBookingsPromise = Booking.find({ agent: objectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("tenant", "fullName email")
      .populate("property", "title price location")
      .lean()

    const [
      totalProperties,
      availableRoomsAgg,
      totalBookings,
      activeBookings,
      pendingBookings,
      totalRevenueAgg,
      recentProperties,
      recentBookings
    ] = await Promise.all([
      totalPropertiesPromise,
      availableRoomsPromise,
      totalBookingsPromise,
      activeBookingsPromise,
      pendingBookingsPromise,
      totalRevenuePromise,
      recentPropertiesPromise,
      recentBookingsPromise
    ])

    const availableRooms =
      Array.isArray(availableRoomsAgg) && availableRoomsAgg.length
        ? availableRoomsAgg[0].totalAvailable
        : 0
    const totalRevenue =
      Array.isArray(totalRevenueAgg) && totalRevenueAgg.length
        ? totalRevenueAgg[0].totalRevenue
        : 0

    return {
      totalProperties,
      availableRooms,
      totalBookings,
      activeBookings,
      pendingBookings,
      totalRevenue,
      recentProperties,
      recentBookings
    }
  }
}

export default new AgentDashboardService()

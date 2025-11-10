import mongoose from "mongoose"
import Booking from "../models/booking.model"
import Property from "../models/property.model"

export class StudentDashboardService {
  async getStudentStats(studentId: string) {
    if (!studentId) throw new Error("studentId is required")

    const objectId = new mongoose.Types.ObjectId(studentId)

    const activeBookingsPromise = Booking.countDocuments({
      student: objectId,
      status: { $in: ["pending", "confirmed"] }
    })

    const savedPropertiesPromise = Property.countDocuments({ savedBy: objectId })

    const upcomingBookingsPromise = Booking.find({
      student: objectId,
      status: { $in: ["pending", "confirmed"] }
    })
      .sort({ startDate: 1 })
      .limit(6)
      .populate("property", "title location price images")
      .populate("agent", "fullName email")
      .lean()

    const [activeBookings, savedProperties, upcomingBookings] = await Promise.all([
      activeBookingsPromise,
      savedPropertiesPromise,
      upcomingBookingsPromise
    ])

    return { activeBookings, savedProperties, upcomingBookings }
  }
}

export default new StudentDashboardService()

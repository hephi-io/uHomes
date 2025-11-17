import Agent from '../models/agent.model';
import Student from '../models/student.model';
import Property from '../models/property.model';
import Booking from '../models/booking.model';
import mongoose from 'mongoose';
import { NotFoundError, BadRequestError } from '../middlewares/error.middlewere';

interface UserUpdatePayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  university?: string;
  yearOfStudy?: string;
}

interface PropertyUpdatePayload {
  title?: string;
  price?: number;
  location?: string;
  isAvailable?: boolean;
  amenities?: string[];
  images?: string[];
}

export class AdminService {
  // --- User Services ---
  async getAllAgents() {
    return Agent.find({ role: 'Agent' }).select('-password').populate({
      path: 'properties',
      select: 'title price location isAvailable',
    });
  }

  async getAllStudents() {
    return Student.find({ role: 'Student' }).select('-password');
  }

  async getUserById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid user ID');

    const user =
      (await Agent.findById(id).select('-password').populate({
        path: 'properties',
        select: 'title price location isAvailable',
      })) || (await Student.findById(id).select('-password'));

    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async updateUser(id: string, data: UserUpdatePayload) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid user ID');

    const updated =
      (await Agent.findByIdAndUpdate(id, data, { new: true }).select('-password').populate({
        path: 'properties',
        select: 'title price location isAvailable',
      })) || (await Student.findByIdAndUpdate(id, data, { new: true }).select('-password'));

    if (!updated) throw new NotFoundError('User not found');
    return updated;
  }

  async deleteUser(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid user ID');

    const deleted = (await Agent.findByIdAndDelete(id)) || (await Student.findByIdAndDelete(id));
    if (!deleted) throw new NotFoundError('User not found');
    return deleted;
  }

  // --- Property Services ---
  async getAllProperties() {
    return Property.find().select('title price location isAvailable agentId').populate({
      path: 'agentId',
      select: 'fullName email phoneNumber',
    });
  }

  async getPropertyById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid property ID');

    const property = await Property.findById(id)
      .select('title price location isAvailable agentId amenities images')
      .populate({
        path: 'agentId',
        select: 'fullName email phoneNumber',
      });

    if (!property) throw new NotFoundError('Property not found');
    return property;
  }

  async updateProperty(id: string, data: PropertyUpdatePayload) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid property ID');

    const updated = await Property.findByIdAndUpdate(id, data, { new: true })
      .select('title price location isAvailable agentId amenities images')
      .populate({
        path: 'agentId',
        select: 'fullName email phoneNumber',
      });

    if (!updated) throw new NotFoundError('Property not found');
    return updated;
  }

  async deleteProperty(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid property ID');

    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Property not found');
    return deleted;
  }

  // --- Booking Services ---
  async getAllBookings() {
    return Booking.find()
      .select(
        'property agent tenant tenantName tenantEmail tenantPhone moveInDate moveOutDate duration amount status paymentStatus'
      )
      .populate({ path: 'property', select: 'title location price isAvailable' })
      .populate({ path: 'agent', select: 'fullName email phoneNumber' })
      .populate({ path: 'tenant', select: 'fullName email university yearOfStudy' });
  }

  async getBookingById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid booking ID');

    const booking = await Booking.findById(id)
      .select(
        'property agent tenant tenantName tenantEmail tenantPhone moveInDate moveOutDate duration amount status paymentStatus'
      )
      .populate({ path: 'property', select: 'title location price isAvailable' })
      .populate({ path: 'agent', select: 'fullName email phoneNumber' })
      .populate({ path: 'tenant', select: 'fullName email university yearOfStudy' });

    if (!booking) throw new NotFoundError('Booking not found');
    return booking;
  }

  async updateBookingStatus(id: string, status: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid booking ID');

    const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true })
      .select(
        'property agent tenant tenantName tenantEmail tenantPhone moveInDate moveOutDate duration amount status paymentStatus'
      )
      .populate({ path: 'property', select: 'title location price isAvailable' })
      .populate({ path: 'agent', select: 'fullName email phoneNumber' })
      .populate({ path: 'tenant', select: 'fullName email university yearOfStudy' });

    if (!updated) throw new NotFoundError('Booking not found');
    return updated;
  }

  async deleteBooking(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid booking ID');

    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Booking not found');
    return deleted;
  }

  async getDashboardStats() {
    const today = new Date();
    const lastYear = new Date(today.getFullYear(), today.getMonth() - 11, 1); // first day 11 months ago

    // --- Total counts ---
    const [totalAgents, totalStudents, totalProperties, totalBookings] = await Promise.all([
      Agent.countDocuments({ role: 'Agent' }),
      Student.countDocuments({ role: 'Student' }),
      Property.countDocuments(),
      Booking.countDocuments(),
    ]);

    // --- Total revenue ---
    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // --- Revenue by Agent ---
    const revenueByAgent = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$agent',
          totalRevenue: { $sum: '$amount' },
          bookingsCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'agents',
          localField: '_id',
          foreignField: '_id',
          as: 'agentInfo',
        },
      },
      { $unwind: '$agentInfo' },
      {
        $project: {
          _id: 0,
          agentId: '$agentInfo._id',
          agentName: '$agentInfo.fullName',
          email: '$agentInfo.email',
          totalRevenue: 1,
          bookingsCount: 1,
        },
      },
    ]);

    // --- Revenue by Month (last 12 months) ---
    const revenueByMonth = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          moveInDate: { $gte: lastYear },
        },
      },
      {
        $group: {
          _id: { year: { $year: '$moveInDate' }, month: { $month: '$moveInDate' } },
          totalRevenue: { $sum: '$amount' },
          bookingsCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          bookingsCount: 1,
        },
      },
    ]);

    return {
      totalAgents,
      totalStudents,
      totalProperties,
      totalBookings,
      totalRevenue,
      revenueByAgent,
      revenueByMonth,
    };
  }
}

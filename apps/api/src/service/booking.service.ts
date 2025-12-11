import mongoose from 'mongoose';
import Booking, { IBooking } from '../models/booking.model';
import property from '../models/property.model';
import UserType from '../models/user-type.model';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../middlewares/error.middlewere';
import { NotificationService } from './notification.service';
import logger from '../utils/logger';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface BookingInput {
  propertyid: string;
  propertyType: string;
  moveInDate: Date;
  moveOutDate?: Date;
  duration: string;
  gender: 'male' | 'female';
  specialRequest?: string;
  amount: number;
  status?: BookingStatus;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

export class BookingService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async createBooking(data: BookingInput, user: { id: string; type?: string }): Promise<IBooking> {
    // Check if logged-in user is a student
    const userType = await UserType.findOne({ userId: new mongoose.Types.ObjectId(user.id) });
    if (!userType) throw new NotFoundError('User type not found');
    if (userType.type !== 'student') {
      throw new UnauthorizedError('Only students can create bookings');
    }

    // Find the property
    const foundProperty = await property.findById(data.propertyid);
    if (!foundProperty) throw new NotFoundError('Property not found');

    // Use the agent assigned to the property
    const agentId = foundProperty.agentId;
    if (!agentId) throw new BadRequestError('Property has no agent assigned');

    // Validate that the agent is actually an agent
    const agentType = await UserType.findOne({ userId: agentId });
    if (!agentType || agentType.type !== 'agent') {
      throw new BadRequestError('Invalid agent assigned to property');
    }

    // Create booking
    const booking = new Booking({
      propertyid: data.propertyid,
      propertyType: data.propertyType,
      moveInDate: data.moveInDate,
      moveOutDate: data.moveOutDate,
      duration: data.duration,
      gender: data.gender,
      specialRequest: data.specialRequest,
      amount: data.amount,
      status: data.status || 'pending',
      paymentStatus: data.paymentStatus || 'pending',
      tenant: user.id,
      agent: agentId,
    });

    const savedBooking = await booking.save();

    // Notify agent about new booking
    try {
      await this.notificationService.createNotification({
        userId: agentId.toString(),
        type: 'booking_created',
        title: 'New Booking Request',
        message: `New booking request received for ${foundProperty.title || 'property'}`,
        relatedId: (savedBooking._id as mongoose.Types.ObjectId).toString(),
        metadata: { propertyId: data.propertyid, amount: data.amount },
      });
    } catch (error) {
      logger.error('Failed to create notification for new booking:', error);
    }

    return savedBooking;
  }
  async getBookingById(bookingId: string, userId: string): Promise<IBooking> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestError('Invalid booking ID');
    }

    const booking = await Booking.findById(bookingId)
      .populate('propertyid', 'title location price images')
      .populate('tenant', 'fullName email phoneNumber')
      .populate('agent', 'fullName email phoneNumber');

    if (!booking) throw new NotFoundError('Booking not found');

    const isAgent = booking.agent?.toString() === userId;
    const isTenant = booking.tenant?.toString() === userId;

    if (!isAgent && !isTenant) {
      throw new UnauthorizedError('Access denied');
    }

    return booking;
  }

  async getBookingsByAgent(agentId: string, userId: string): Promise<IBooking[]> {
    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      throw new BadRequestError('Invalid agent ID');
    }

    if (agentId !== userId) {
      throw new UnauthorizedError('Access denied');
    }

    return await Booking.find({ agent: agentId })
      .populate('propertyid', 'title location price images')
      .populate('tenant', 'fullName email phoneNumber')
      .sort({ createdAt: -1 });
  }

  async getAllBookings(user: { id: string; type?: string }, page = 1, limit = 10) {
    const userType = await UserType.findOne({ userId: user.id });
    if (!userType) throw new NotFoundError('User type not found');

    let query = {};

    if (userType.type === 'agent') query = { agent: user.id };
    if (userType.type === 'student') query = { tenant: user.id };

    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const bookings = await Booking.find(query)
      .populate('propertyid', 'title location price images')
      .populate('tenant', 'fullName email phoneNumber')
      .populate('agent', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { bookings, total, page, limit, totalPages };
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestError('Invalid booking ID');
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.agent.toString() !== userId) {
      throw new UnauthorizedError('Only the assigned agent can update this booking');
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    // Notify student about booking status update
    try {
      const statusMessages: Record<string, string> = {
        confirmed: 'Your booking has been confirmed!',
        cancelled: 'Your booking has been cancelled',
        completed: 'Your booking has been completed',
      };

      const message = statusMessages[status] || `Your booking status has been updated to ${status}`;

      await this.notificationService.createNotification({
        userId: booking.tenant.toString(),
        type: 'booking_updated',
        title: 'Booking Status Updated',
        message,
        relatedId: (booking._id as mongoose.Types.ObjectId).toString(),
        metadata: { status, propertyId: booking.propertyid.toString() },
      });
    } catch (error) {
      logger.error('Failed to create notification for booking update:', error);
    }

    return updatedBooking;
  }

  async deleteBooking(bookingId: string, user: { id: string; role: string }) {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestError('Invalid booking ID');
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    const canDelete =
      user.role === 'Admin' ||
      booking.agent.toString() === user.id ||
      booking.tenant.toString() === user.id;

    if (!canDelete) throw new UnauthorizedError('Access denied');

    // Notify both parties about booking deletion
    try {
      const propertyData = await property.findById(booking.propertyid);
      const propertyTitle = propertyData?.title || 'property';

      // Notify the other party
      const notifyUserId =
        user.id === booking.agent.toString() ? booking.tenant.toString() : booking.agent.toString();

      await this.notificationService.createNotification({
        userId: notifyUserId,
        type: 'booking_deleted',
        title: 'Booking Deleted',
        message: `Booking for ${propertyTitle} has been deleted`,
        relatedId: (booking._id as mongoose.Types.ObjectId).toString(),
        metadata: { deletedBy: user.id },
      });
    } catch (error) {
      logger.error('Failed to create notification for booking deletion:', error);
    }

    await booking.deleteOne();
    return booking;
  }

  async getActiveBookingsSummary(userId: string) {
    const userType = await UserType.findOne({ userId });
    if (!userType) throw new NotFoundError('User type not found');
    if (userType.type !== 'student') {
      throw new UnauthorizedError('Only students can access this data');
    }

    const result = await Booking.aggregate([
      {
        $match: {
          tenant: new mongoose.Types.ObjectId(userId),
          status: 'confirmed',
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    if (result.length === 0) {
      return { count: 0, totalAmount: 0 };
    }

    return {
      count: result[0].count,
      totalAmount: result[0].totalAmount,
    };
  }
}

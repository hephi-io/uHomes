import mongoose from 'mongoose';

import Booking, { IBooking } from '../models/booking.model';
import property from '../models/property.model';
import UserType from '../models/user-type.model';

import { BadRequestError, NotFoundError, UnauthorizedError } from '../middlewares/error.middlewere';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface BookingInput {
  property: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  moveInDate: Date;
  moveOutDate?: Date;
  duration: string;
  amount: number;
  status?: BookingStatus;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  notes?: string;
}

export class BookingService {
  async createBooking(data: BookingInput, user: { id: string; type?: string }): Promise<IBooking> {
    // Validate user type
    const userType = await UserType.findOne({ userId: user.id });
    if (!userType) throw new NotFoundError('User type not found');
    if (userType.type !== 'student') {
      throw new UnauthorizedError('Only students can create bookings');
    }

    const foundProperty = await property.findById(data.property);
    if (!foundProperty) throw new NotFoundError('Property not found');

    const agentId = Array.isArray(foundProperty.agentId)
      ? foundProperty.agentId[0]
      : foundProperty.agentId;

    // Validate agent type
    if (agentId) {
      const agentType = await UserType.findOne({ userId: agentId });
      if (!agentType || agentType.type !== 'agent') {
        throw new BadRequestError('Invalid agent assigned to property');
      }
    }

    const booking = new Booking({
      ...data,
      tenant: user.id,
      agent: agentId,
    });

    return await booking.save();
  }

  async getBookingById(bookingId: string, userId: string): Promise<IBooking> {
    if (!mongoose.Types.ObjectId.isValid(bookingId))
      throw new BadRequestError('Invalid booking ID');

    const booking = await Booking.findById(bookingId)
      .populate('property', 'title location price')
      .populate('tenant', 'fullName email phoneNumber')
      .populate('agent', 'fullName email phoneNumber');

    if (!booking) throw new NotFoundError('Booking not found');

    const isAgent = booking.agent && booking.agent.toString() === userId;
    const isTenant = booking.tenant && booking.tenant.toString() === userId;
    if (!isAgent && !isTenant) throw new UnauthorizedError('Access denied');

    return booking;
  }

  async getBookingsByAgent(agentId: string, userId: string): Promise<IBooking[]> {
    if (!mongoose.Types.ObjectId.isValid(agentId)) throw new BadRequestError('Invalid agent ID');
    if (agentId !== userId) throw new UnauthorizedError('Access denied');

    return await Booking.find({ agent: agentId })
      .populate('property', 'title location price')
      .populate('tenant', 'fullName email phoneNumber')
      .sort({ createdAt: -1 });
  }

  async getAllBookings(user: { id: string; type?: string }): Promise<IBooking[]> {
    // Get user type
    const userType = await UserType.findOne({ userId: user.id });
    if (!userType) throw new NotFoundError('User type not found');

    // Admins can see all bookings, agents only see their bookings, students see their own
    let query = {};
    if (userType.type === 'agent') {
      query = { agent: user.id };
    } else if (userType.type === 'student') {
      query = { tenant: user.id };
    }
    // Admin sees all (empty query)

    return await Booking.find(query)
      .populate('property', 'title location price')
      .populate('tenant', 'fullName email phoneNumber')
      .populate('agent', 'fullName email phoneNumber')
      .sort({ createdAt: -1 });
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    userId: string
  ): Promise<IBooking> {
    if (!mongoose.Types.ObjectId.isValid(bookingId))
      throw new BadRequestError('Invalid booking ID');

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.agent.toString() !== userId)
      throw new UnauthorizedError('Only the assigned agent can update this booking');

    booking.status = status;
    return await booking.save();
  }

  async deleteBooking(bookingId: string, user: { id: string; role: string }): Promise<IBooking> {
    if (!mongoose.Types.ObjectId.isValid(bookingId))
      throw new BadRequestError('Invalid booking ID');

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    const canDelete =
      user.role === 'Admin' ||
      booking.agent.toString() === user.id ||
      booking.tenant.toString() === user.id;

    if (!canDelete) throw new UnauthorizedError('Access denied');

    await booking.deleteOne();
    return booking;
  }
}

import Booking, { IBooking } from '../models/booking.model';
import property from '../models/property.model';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../middlewares/error.middlewere';
import {BookingPayload} from '../interface/user.paload';


export class BookingService {

    async createBooking(data: BookingPayload, user: { id: string, types: string }): Promise<IBooking> {
    const foundProperty = await property.findById(data.propertyid)
    if (!foundProperty) throw new NotFoundError('Property not found')

    const agentId = foundProperty.agentId
    if (!agentId) throw new BadRequestError('Property has no assigned agent')

    let tenantId = data.tenant
    if (user.types === 'Student') tenantId = user.id
    if (user.types === 'Agent' && !tenantId) throw new BadRequestError('Tenant is required when an agent creates a booking')

    if (!data.propertyType) throw new BadRequestError('propertyType is required')
    if (!data.gender) throw new BadRequestError('gender is required')

    const booking = new Booking({
      propertyid: data.propertyid,
      tenant: tenantId,
      agent: agentId,
      propertyType: data.propertyType,
      gender: data.gender,
      specialRequest: data.specialRequest,
      moveInDate: data.moveInDate,
      moveOutDate: data.moveOutDate,
      duration: data.duration,
      amount: data.amount,
      status: data.status || 'pending',
      paymentStatus: data.paymentStatus || 'pending'
    })

    return await booking.save()
  }

  async getBookingById(bookingId: string, user: { id: string; types: string }): Promise<IBooking> {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new BadRequestError('Invalid booking ID')
  }

  const booking = await Booking.findById(bookingId)
    .populate('propertyid', 'title location price')
    .populate('tenant', 'fullName email phoneNumber')
    .populate('agent', 'fullName email phoneNumber')

  if (!booking) {
    throw new NotFoundError('Booking not found')
  }


  const userIsAgent = booking.agent?._id.toString() === user.id
  const userIsTenant = booking.tenant?._id.toString() === user.id

  if (!userIsAgent && !userIsTenant && user.types !== 'Admin') {
    throw new UnauthorizedError('Access denied')
  }

  return booking
}

  async getAllBookings(user: { id: string; types: string }): Promise<{ bookings: IBooking[], count: number, lastUpdated: Date }> {
    let query = {}

    if (user.types === 'Agent') {
      query = { agent: user.id }
    } else if (user.types === 'Student') {

      query = { tenant: user.id }

    }

    const bookings = await Booking.find(query)
      .populate('propertyid', 'title location price')
      .populate('tenant', 'fullName email phoneNumber')
      .populate('agent', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })

    return {
      bookings,
      count: bookings.length,
      lastUpdated: new Date()
    }
  }

  async getBookingsByAgent(agentId: string, user: { id: string; types: string }): Promise<{ bookings: IBooking[], count: number, lastUpdated: Date }> {
    if (!mongoose.Types.ObjectId.isValid(agentId)) throw new BadRequestError('Invalid agent ID')
    if (user.id !== agentId && user.types !== 'Admin') throw new UnauthorizedError('Access denied')

    const bookings = await Booking.find({ agent: agentId })
      .populate('propertyid', 'title location price')
      .populate('tenant', 'fullName email phoneNumber')
      .populate('agent', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })

    return {
      bookings,
      count: bookings.length,
      lastUpdated: new Date()
    }
  }



async updateBookingStatus(
  bookingId: string,
  status: BookingPayload['status'],
  user: { id: string; types: string }
): Promise<IBooking> {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) throw new BadRequestError('Invalid booking ID')

  const booking = await Booking.findById(bookingId)
  if (!booking) throw new NotFoundError('Booking not found')

  // Only the assigned agent or Admin can update
  if (booking.agent.toString() !== user.id && user.types !== 'Admin') {
    throw new UnauthorizedError('Only the assigned agent can update this booking')
  }

  if (status === undefined) throw new BadRequestError('Status is required')

  booking.status = status
  return await booking.save()
}

async deleteBooking(bookingId: string, user: { id: string; types: string }): Promise<IBooking> {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) throw new BadRequestError('Invalid booking ID')

  const booking = await Booking.findById(bookingId)
  if (!booking) throw new NotFoundError('Booking not found')

  const canDelete =
    user.types === 'Admin' ||
    booking.agent?.toString() === user.id ||
    booking.tenant?.toString() === user.id

  if (!canDelete) throw new UnauthorizedError('Access denied')

  await booking.deleteOne()
  return booking
}

    
    

}

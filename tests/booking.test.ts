import mongoose from 'mongoose';
import Booking from '../src/models/booking.model';
import Property from '../src/models/property.model';
import User from '../src/models/user.model';
import User_type from '../src/models/user-type.model';
import { BookingService } from '../src/service/booking.service';
import { NotFoundError } from '../src/middlewares/error.middlewere';

describe('BookingService', () => {
  let bookingService: BookingService;
  let propertyId: string;
  let studentId: string;
  let agentId: string;

  beforeAll(async () => {
    bookingService = new BookingService();

    // Create agent
    const agent = await User.create({
      fullName: 'Agent',
      email: 'agent@test.com',
      password: 'password',
      phoneNumber: '08123456789',
    });
    agentId = agent._id.toString();

    await User_type.create({
      userId: agent._id,
      types: 'Agent',
    });

    // Create property with all required fields
    const property = await Property.create({
      title: 'Property',
      description: 'Nice property',
      location: 'City',
      pricePerSemester: 1000,
      roomsAvailable: 10,
      roomTypes: { single: { price: 1000 } },
      images: [{ url: 'url', cloudinary_id: 'id' }],
      amenities: { wifi: true, kitchen: true, security: true, parking: true, power24_7: true, gym: true },
      isAvailable: true,
      agentId: agent._id,
    });
    propertyId = property._id.toString();

    // Create student
    const student = await User.create({
      fullName: 'Student',
      email: 'student@test.com',
      password: 'password',
      phoneNumber: '0900000000',
    });
    studentId = student._id.toString();
  });

  afterEach(async () => {
    await Booking.deleteMany({});
  });

  it('should create a booking for a student', async () => {
    const bookingData = {
      propertyid: propertyId,
      moveInDate: new Date(),
      duration: '6 months',
      amount: 500,
      propertyType: 'single',
      gender: 'male' as const, // ensure TS compatibility
    };

    const booking = await bookingService.createBooking(bookingData, {
      id: studentId,
      types: 'Student',
    });

    expect(booking.tenant.toString()).toBe(studentId);
    expect(booking.propertyid.toString()).toBe(propertyId);
  });

  it('should throw unauthorized for non-student without tenant', async () => {
    const bookingData = {
      propertyid: propertyId,
      moveInDate: new Date(),
      duration: '6 months',
      amount: 500,
      propertyType: 'single',
      gender: 'male' as const,
    };

    await expect(
      bookingService.createBooking(bookingData, { id: agentId, types: 'Agent' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should update booking status by agent', async () => {
    const booking = await Booking.create({
      propertyid: propertyId,
      tenant: studentId,
      agent: agentId,
      moveInDate: new Date(),
      duration: '6 months',
      amount: 500,
      propertyType: 'single',
      gender: 'male' as const,
      status: 'pending',
      paymentStatus: 'pending',
    });

    const updated = await bookingService.updateBookingStatus(
      booking._id.toString(),
      'confirmed',
      { id: agentId, types: 'Agent' }
    );

    expect(updated.status).toBe('confirmed');
  });
});

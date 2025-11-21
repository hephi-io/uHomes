import mongoose from 'mongoose';
import Property from '../src/models/property.model';
import Agent from '../src/models/agent.model';
import Booking from '../src/models/booking.model';
import { BookingService } from '../src/service/booking.service';
import { BadRequestError, UnauthorizedError } from '../src/middlewares/error.middlewere';

describe('BookingService', () => {
  let bookingService: BookingService;
  let propertyId: string;
  let studentId: string;
  let agentId: string;

  beforeAll(async () => {
    bookingService = new BookingService();

    const agent = await Agent.create({
      fullName: 'Agent',
      email: 'agent@test.com',
      password: 'password',
      phoneNumber: '08123456789',
    });
    agentId = (agent._id as mongoose.Types.ObjectId).toString();

    const property = (await Property.create({
      title: 'Property',
      location: 'City',
      price: 1000,
      agentId: [agentId],
      images: [],
    })) as mongoose.Document & { _id: mongoose.Types.ObjectId };
    propertyId = property._id.toString();

    studentId = new mongoose.Types.ObjectId().toString();
  });

  afterEach(async () => {
    await Booking.deleteMany({});
  });

  it('should create a booking for a student', async () => {
    const bookingData = {
      property: propertyId,
      tenantName: 'John Doe',
      tenantEmail: 'john@test.com',
      tenantPhone: '123456',
      moveInDate: new Date(),
      duration: '6 months',
      amount: 500,
    };

    const booking = await bookingService.createBooking(bookingData, {
      id: studentId,
      role: 'Student',
    });
    expect(booking.tenant.toString()).toBe(studentId);
    expect(booking.property.toString()).toBe(propertyId);
  });

  it('should throw unauthorized for non-student', async () => {
    const bookingData = {
      property: propertyId,
      tenantName: 'John',
      tenantEmail: 'john@test.com',
      tenantPhone: '123456',
      moveInDate: new Date(),
      duration: '6 months',
      amount: 500,
    };
    await expect(
      bookingService.createBooking(bookingData, { id: agentId, role: 'Agent' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should update booking status by agent', async () => {
    const booking = (await Booking.create({
      property: propertyId,
      tenant: studentId,
      agent: agentId,
      tenantName: 'John',
      tenantEmail: 'john@test.com',
      tenantPhone: '123456',
      moveInDate: new Date(),
      duration: '6 months',
      amount: 500,
      status: 'pending',
    })) as mongoose.Document & {
      _id: mongoose.Types.ObjectId;
      agent: mongoose.Types.ObjectId;
      tenant: mongoose.Types.ObjectId;
    };

    const updated = await bookingService.updateBookingStatus(
      booking._id.toString(),
      'confirmed',
      agentId
    );
    expect(updated.status).toBe('confirmed');
  });

  it('should throw BadRequestError for invalid booking ID', async () => {
    await expect(bookingService.getBookingById('invalidId', studentId)).rejects.toThrow(
      BadRequestError
    );
  });
});

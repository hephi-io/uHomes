import mongoose from 'mongoose';
import Property from '../src/models/property.model';
import User from '../src/models/user.model';
import UserType from '../src/models/user-type.model';
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

    const agent = await User.create({
      fullName: 'Agent',
      email: 'agent@test.com',
      password: 'password',
      phoneNumber: '08123456789',
      nin: '12345678901', // NIN required for agents (KYC verification)
    });
    agentId = (agent._id as mongoose.Types.ObjectId).toString();
    await UserType.create({
      userId: agent._id,
      type: 'agent',
    });

    const property = (await Property.create({
      title: 'Property',
      location: 'City',
      pricePerSemester: 1000,
      description: 'Test property description',
      roomsAvailable: 5,
      agentId: new mongoose.Types.ObjectId(agentId),
      amenities: {
        wifi: false,
        kitchen: false,
        security: false,
        parking: false,
        power24_7: false,
        gym: false,
      },
      images: [],
    })) as mongoose.Document & { _id: mongoose.Types.ObjectId };
    propertyId = property._id.toString();

    const student = await User.create({
      fullName: 'Student',
      email: 'student@test.com',
      password: 'password',
      phoneNumber: '08123456780',
    });
    studentId = (student._id as mongoose.Types.ObjectId).toString();
    await UserType.create({
      userId: student._id,
      type: 'student',
    });
  });

  afterEach(async () => {
    await Booking.deleteMany({});
  });

  it('should create a booking for a student', async () => {
    const bookingData = {
      propertyid: propertyId,
      propertyType: 'apartment',
      moveInDate: new Date(),
      duration: '6 months',
      gender: 'male' as 'male' | 'female',
      amount: 500,
    };

    const booking = await bookingService.createBooking(bookingData, {
      id: studentId,
      type: 'student',
    });
    expect(booking.tenant.toString()).toBe(studentId);
    expect(booking.propertyid.toString()).toBe(propertyId);
  });

  it('should throw unauthorized for non-student', async () => {
    // Ensure UserType exists for agent (in case it was cleaned up)
    const existingUserType = await UserType.findOne({
      userId: new mongoose.Types.ObjectId(agentId),
    });
    if (!existingUserType) {
      await UserType.create({
        userId: new mongoose.Types.ObjectId(agentId),
        type: 'agent',
      });
    }

    const bookingData = {
      propertyid: propertyId,
      propertyType: 'apartment',
      moveInDate: new Date(),
      duration: '6 months',
      gender: 'male' as 'male' | 'female',
      amount: 500,
    };
    // The code converts userId to ObjectId, so it should find the UserType and throw UnauthorizedError
    await expect(
      bookingService.createBooking(bookingData, { id: agentId, type: 'agent' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should update booking status by agent', async () => {
    const booking = (await Booking.create({
      propertyid: new mongoose.Types.ObjectId(propertyId),
      propertyType: 'apartment',
      tenant: new mongoose.Types.ObjectId(studentId),
      agent: new mongoose.Types.ObjectId(agentId),
      tenantName: 'John',
      tenantEmail: 'john@test.com',
      tenantPhone: '123456',
      moveInDate: new Date(),
      duration: '6 months',
      gender: 'male',
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

import mongoose from 'mongoose';
import Property from '../src/models/property.model';
import User from '../src/models/user.model';
import User_type from '../src/models/user-type.model';
import { PropertyService } from '../src/service/property.service';
import cloudinary from '../src/config/cloudinary';
import { BadRequestError, NotFoundError } from '../src/middlewares/error.middlewere';

jest.mock('../src/config/cloudinary', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({ secure_url: 'url', public_id: 'id' }),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
  },
}));

describe('PropertyService', () => {
  let propertyService: PropertyService;

  beforeAll(async () => {
    propertyService = new PropertyService();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Property.deleteMany({});
    await User.deleteMany({});
    await User_type.deleteMany({});
  });

  it('should create a property', async () => {
    const agent = await User.create({
      fullName: 'Test Agent',
      email: 'agent@test.com',
      password: 'password',
      phoneNumber: '08123456789',
    });

    await User_type.create({ userId: agent._id, types: 'Agent' });

    const data = {
      title: 'Test Property',
      description: 'Nice property',
      location: 'City',
      pricePerSemester: 1000,
      roomsAvailable: 2,
      roomTypes: { single: { price: 1000 } },
      amenities: {
        wifi: true,
        kitchen: true,
        security: true,
        parking: false,
        power24_7: false,
        gym: true,
      },
    };

    const files = [{ path: 'path/to/file.jpg' }];

    const property = await propertyService.createProperty(agent._id.toString(), data, files as any);

    expect(property.title).toBe('Test Property');
    expect(property.images).toHaveLength(1);
    expect(cloudinary.uploader.upload).toHaveBeenCalled();
  });

  it('should throw BadRequestError if no files are provided', async () => {
    const agent = await User.create({
      fullName: 'Agent No Files',
      email: 'nofiles@test.com',
      password: 'password',
      phoneNumber: '08123456780',
    });

    await User_type.create({ userId: agent._id, types: 'Agent' });

    const data = {
      title: 'Test Property',
      description: 'Some description',
      location: 'City',
      pricePerSemester: 1000,
      roomsAvailable: 1,
      roomTypes: { single: { price: 1000 } },
      amenities: {
        wifi: false,
        kitchen: false,
        security: false,
        parking: false,
        power24_7: false,
        gym: false,
      },
    };

    await expect(propertyService.createProperty(agent._id.toString(), data, []))
      .rejects.toThrow(BadRequestError);
  });

  it('should get property by id', async () => {
    const agent = await User.create({
      fullName: 'Fetch Agent',
      email: 'fetch@test.com',
      password: 'password',
      phoneNumber: '08123456781',
    });
    await User_type.create({ userId: agent._id, types: 'Agent' });

    const property = await Property.create({
      title: 'Fetch Property',
      description: 'Description',
      location: 'City',
      pricePerSemester: 1000,
      roomsAvailable: 2,
      roomTypes: { single: { price: 1000 } },
      amenities: {
        wifi: true,
        kitchen: false,
        security: true,
        parking: false,
        power24_7: false,
        gym: false,
      },
      images: [{ url: 'url', cloudinary_id: 'id' }],
      agentId: agent._id,
      isAvailable: true,
    });

    const fetched = await propertyService.getPropertyById(property._id.toString());
    expect(fetched._id.toString()).toBe(property._id.toString());
  });

  it('should delete property and images', async () => {
    const agent = await User.create({
      fullName: 'Delete Agent',
      email: 'delete@test.com',
      password: 'password',
      phoneNumber: '08123456782',
    });
    await User_type.create({ userId: agent._id, types: 'Agent' });

    const property = await Property.create({
      title: 'Delete Me',
      description: 'Desc',
      location: 'City',
      pricePerSemester: 1000,
      roomsAvailable: 1,
      roomTypes: { single: { price: 1000 } },
      amenities: {
        wifi: true,
        kitchen: false,
        security: false,
        parking: false,
        power24_7: false,
        gym: false,
      },
      images: [{ url: 'url', cloudinary_id: 'id' }],
      agentId: agent._id,
      isAvailable: true,
    });

    await propertyService.deleteProperty(property._id.toString());

    const found = await Property.findById(property._id);
    expect(found).toBeNull();
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('id');
  });
});

import mongoose from 'mongoose';
import Property, { IProperty } from '../src/models/property.model';
import User from '../src/models/user.model';
import UserType from '../src/models/user-type.model';
import { PropertyService } from '../src/service/property.service';
import cloudinary from '../src/config/cloudinary';
import { BadRequestError } from '../src/middlewares/error.middlewere';

jest.mock('../src/config/cloudinary', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({ secure_url: 'url', public_id: 'id' }),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
  },
}));

describe('PropertyService', () => {
  let propertyService: PropertyService;
  let agentId: string;

  beforeAll(async () => {
    propertyService = new PropertyService();
    const agent = await User.create({
      fullName: 'Test Agent',
      email: 'agent@test.com',
      password: 'password',
      phoneNumber: '08123456789',
    });
    agentId = (agent._id as mongoose.Types.ObjectId).toString();
    await UserType.create({
      userId: agent._id,
      type: 'agent',
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Property.deleteMany({});
  });

  it('should create a property', async () => {
    const data: Partial<IProperty> = {
      title: 'Test Property',
      location: 'City',
      price: 1000,
      roomType: 'single',
      description: 'Nice property',
      amenities: {
        wifi: true,
        kitchen: false,
        security: true,
        parking: false,
        power24_7: false,
        gym: true,
      },
      isAvailable: true,
    };
    const files = [{ path: 'path/to/file.jpg' }];
    const property = await propertyService.createProperty(
      agentId,
      data,
      files as unknown as Express.Multer.File[]
    );
    expect(property.title).toBe('Test Property');
    expect(property.images).toHaveLength(1);
    expect(cloudinary.uploader.upload).toHaveBeenCalled();
  });

  it('should throw error if no files', async () => {
    // Ensure UserType exists for this test
    const userType = await UserType.findOne({ userId: new mongoose.Types.ObjectId(agentId) });
    if (!userType) {
      await UserType.create({
        userId: new mongoose.Types.ObjectId(agentId),
        type: 'agent',
      });
    }
    await expect(propertyService.createProperty(agentId, { title: 'Test' }, [])).rejects.toThrow(
      BadRequestError
    );
  });

  it('should get property by id', async () => {
    const property = await Property.create({
      title: 'Test',
      location: 'City',
      price: 1000,
      roomType: 'shared',
      description: 'Desc',
      amenities: {
        wifi: false,
        kitchen: false,
        security: false,
        parking: false,
        power24_7: false,
        gym: false,
      },
      isAvailable: true,
      images: [{ url: 'url', cloudinary_id: 'id' }],
      agentId: new mongoose.Types.ObjectId(agentId),
    } as unknown as IProperty);

    const fetched = await propertyService.getPropertyById(
      (property._id as mongoose.Types.ObjectId).toString()
    );
    expect((fetched._id as mongoose.Types.ObjectId).toString()).toBe(
      (property._id as mongoose.Types.ObjectId).toString()
    );
  });

  it('should delete property and images', async () => {
    const property = await Property.create({
      title: 'Delete Me',
      location: 'City',
      price: 1000,
      roomType: 'self_contain',
      description: 'Desc',
      amenities: {
        wifi: false,
        kitchen: false,
        security: false,
        parking: false,
        power24_7: false,
        gym: false,
      },
      isAvailable: true,
      agentId: new mongoose.Types.ObjectId(agentId),
      images: [{ url: 'url', cloudinary_id: 'id' }],
    } as unknown as IProperty);

    await propertyService.deleteProperty((property._id as mongoose.Types.ObjectId).toString());
    const found = await Property.findById(property._id);
    expect(found).toBeNull();
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('id');
  });
});

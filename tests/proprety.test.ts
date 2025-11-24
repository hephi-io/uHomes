import mongoose from 'mongoose';
import Property from '../src/models/property.model';
import User from '../src/models/user.model';
import User_type from '../src/models/user-type.model';
import { PropertyService } from '../src/service/property.service';
import cloudinary from '../src/config/cloudinary';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../src/middlewares/error.middlewere';

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
    agentId = agent._id.toString();

    await User_type.create({
      userId: agent._id,
      types: 'Agent',
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Property.deleteMany({});
  });

  it('should create a property', async () => {
    const data = {
      title: 'Test Property',
      location: 'City',
      price: 1000,
      description: 'Nice property',
      amenities: ['pool', 'gym'],
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
    await expect(
    propertyService.createProperty(agentId, { title: 'Test', location: 'City', price: 500 } as any, [])
  ).rejects.toThrow(NotFoundError);

  });

  it('should get property by id', async () => {
    const property = await Property.create({
      title: 'Test',
      location: 'City',
      price: 1000,
      description: 'Desc',
      amenities: [],
      isAvailable: true,
      images: [{ url: 'url', cloudinary_id: 'id' }],
      agentId: new mongoose.Types.ObjectId(agentId),
    });

    const fetched = await propertyService.getPropertyById(property._id.toString());
    expect(fetched._id.toString()).toBe(property._id.toString());
  });

  it('should delete property and images', async () => {
    const property = await Property.create({
      title: 'Delete Me',
      location: 'City',
      price: 1000,
      description: 'Desc',
      amenities: [],
      isAvailable: true,
      images: [{ url: 'url', cloudinary_id: 'id' }],
      agentId: new mongoose.Types.ObjectId(agentId),
    });

    await propertyService.deleteProperty(property._id.toString());

    const found = await Property.findById(property._id);
    expect(found).toBeNull();
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('id');
  });
});

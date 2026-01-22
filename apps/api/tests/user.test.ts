import mongoose from 'mongoose';
import User from '../src/models/user.model';
import UserType from '../src/models/user-type.model';
import Property from '../src/models/property.model';
import Token from '../src/models/token.model';
import { UserService } from '../src/service/user.service';
import cloudinary from '../src/config/cloudinary';

// Mock Cloudinary
jest.mock('../src/config/cloudinary', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({ secure_url: 'url', public_id: 'id' }),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
  },
  default: {
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: 'url', public_id: 'id' }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

// Mock sendEmail
jest.mock('../src/utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

// Mock verification-email
jest.mock('../src/utils/verification-email', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
}));

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    userService = new UserService();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await User.deleteMany({});
    await UserType.deleteMany({});
    await Property.deleteMany({});
    await Token.deleteMany({});
  });

  describe('deleteUser', () => {
    it('should delete a simple user (student)', async () => {
      const user = await User.create({
        fullName: 'Test Student',
        email: 'student@test.com',
        password: 'password',
        phoneNumber: '08123456789',
      });
      await UserType.create({ userId: user._id, type: 'student' });

      await userService.deleteUser((user._id as mongoose.Types.ObjectId).toString());

      const deletedUser = await User.findById(user._id);
      const deletedUserType = await UserType.findOne({ userId: user._id });

      expect(deletedUser).toBeNull();
      expect(deletedUserType).toBeNull();
    });

    it('should delete an agent and their properties (Admin Delete Bad Actor)', async () => {
      // 1. Create Agent
      const agent = await User.create({
        fullName: 'Bad Agent',
        email: 'badagent@test.com',
        password: 'password',
        phoneNumber: '09012345678',
        nin: '12345678901',
      });
      const agentId = (agent._id as mongoose.Types.ObjectId).toString();
      await UserType.create({ userId: agent._id, type: 'agent' });

      // 2. Create Property for Agent
      const property = await Property.create({
        title: 'Bad Property',
        location: 'Nowhere',
        price: 100,
        roomType: 'single',
        description: 'Bad',
        agentId: agent._id,
        images: [{ url: 'http://img.com/1', cloudinary_id: 'bad_img_1' }],
        isAvailable: true,
      });

      // 3. Delete Agent
      await userService.deleteUser(agentId);

      // 4. Assertions
      const deletedAgent = await User.findById(agent._id);
      expect(deletedAgent).toBeNull();

      const deletedProperty = await Property.findById(property._id);
      expect(deletedProperty).toBeNull();

      // Check Cloudinary destroy was called
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('bad_img_1');
    });
  });
});

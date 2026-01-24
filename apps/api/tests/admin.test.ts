import mongoose from 'mongoose';
import User from '../src/models/user.model';
import UserType from '../src/models/user-type.model';
import { AdminService } from '../src/service/admin.service';
import { NotFoundError } from '../src/middlewares/error.middlewere';

describe('AdminService', () => {
  let adminService: AdminService;
  let agentId: string;

  beforeAll(async () => {
    adminService = new AdminService();
  });

  beforeEach(async () => {
    // Create a test agent
    const agent = await User.create({
      fullName: 'Test Agent',
      email: 'agent@test.com',
      password: 'password',
      phoneNumber: '08123456789',
      nin: '12345678901',
      ninVerificationStatus: 'pending',
    });
    agentId = (agent._id as mongoose.Types.ObjectId).toString();
    await UserType.create({
      userId: agent._id,
      type: 'agent',
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
    await UserType.deleteMany({});
  });

  describe('verifyAgent', () => {
    it('should verify an agent', async () => {
      const result = await adminService.verifyAgent(agentId, 'verified');

      expect(result.status).toBe('verified');

      const updatedUser = await User.findById(agentId);
      expect(updatedUser?.ninVerificationStatus).toBe('verified');
    });

    it('should reject an agent', async () => {
      const result = await adminService.verifyAgent(agentId, 'rejected');

      expect(result.status).toBe('rejected');

      const updatedUser = await User.findById(agentId);
      expect(updatedUser?.ninVerificationStatus).toBe('rejected');
    });

    it('should throw NotFoundError if user does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(adminService.verifyAgent(fakeId, 'verified')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Create another user
      await User.create({
        fullName: 'Test Student',
        email: 'student@test.com',
        password: 'password',
        phoneNumber: '09012345678',
      });

      const users = await adminService.getAllUsers();
      expect(users).toHaveLength(2); // Agent + Student

      // Check that password is not present or is undefined on the document
      expect(users[0].get('password')).toBeUndefined();

      // Check that password is removed when converted to JSON (what is sent to client)
      const userJson = users[0].toJSON();
      expect(userJson).not.toHaveProperty('password');
    });
  });
});

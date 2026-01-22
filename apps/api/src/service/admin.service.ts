import User from '../models/user.model';
import { NotFoundError } from '../middlewares/error.middlewere';

export class AdminService {
  // Verify or Reject an Agent's NIN

  async verifyAgent(userId: string, status: 'verified' | 'rejected') {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Optional: Check if user is actually an agent
    // if (user.type !== 'agent') throw new BadRequestError('User is not an agent');

    user.ninVerificationStatus = status;
    await user.save();

    return {
      id: user._id,
      email: user.email,
      status: user.ninVerificationStatus,
    };
  }

  //Get all users (excluding passwords)

  async getAllUsers() {
    // Return all users sorted by newest first
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return users;
  }
}

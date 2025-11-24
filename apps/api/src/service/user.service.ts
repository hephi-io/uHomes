import User, { IUser } from '../models/user.model';
import UserType from '../models/user-type.model';
import Token from '../models/token.model';
import { randomBytes } from 'crypto';
import { sendEmail } from '../utils/sendEmail';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../middlewares/error.middlewere';

interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  type: 'student' | 'agent' | 'admin';
  // Student-specific
  university?: string;
  yearOfStudy?: '100' | '200' | '300' | '400' | '500';
  // Agent-specific (can be added later if needed)
}

export class UserService {
  /**
   * Get user type by userId (with caching potential)
   */
  async getUserType(userId: string): Promise<string> {
    const userType = await UserType.findOne({ userId });
    if (!userType) throw new NotFoundError('User type not found');
    return userType.type;
  }

  /**
   * Register a new user with their type
   */
  async register(data: RegisterData) {
    const { fullName, email, phoneNumber, password, type, university, yearOfStudy } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new BadRequestError('Email already in use');

    // Validate type-specific fields
    if (type === 'student') {
      if (!university) throw new BadRequestError('University is required for students');
      if (!yearOfStudy) throw new BadRequestError('Year of study is required for students');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const userData = {
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      ...(type === 'student' && { university, yearOfStudy }),
      ...(type === 'agent' && { properties: [], totalRevenue: 0 }),
    };

    const user = new User(userData);
    await user.save();

    // Create UserType document
    const userType = new UserType({
      userId: user._id,
      type,
    });
    await userType.save();

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');

    await Token.create({
      userId: user._id,
      typeOf: 'emailVerification',
      token: verificationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
    });

    // Send verification email
    const verifyLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;
    const html = `
      <h3>Welcome to U-Homes!</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">Verify Email</a>
    `;

    await sendEmail(email, 'Verify Your Email', html);

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  /**
   * Verify user email
   */
  async verifyEmail(tokenString: string) {
    const tokenDoc = await Token.findOne({
      token: tokenString,
      typeOf: 'emailVerification',
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) throw new BadRequestError('Invalid or expired verification token');

    const user = await User.findById(tokenDoc.userId);
    if (!user) throw new NotFoundError('User not found');

    user.isVerified = true;
    await user.save();

    await tokenDoc.deleteOne();

    return { message: 'Email verified successfully' };
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError('User not found');

    if (user.isVerified) throw new BadRequestError('Email already verified');

    // Generate a new verification token
    const verificationToken = randomBytes(32).toString('hex');
    await Token.create({
      userId: user._id,
      typeOf: 'emailVerification',
      token: verificationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    const verifyLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;
    const html = `
      <h3>Welcome back to U-Homes!</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">Verify Email</a>
    `;

    await sendEmail(user.email, 'Verify Your Email', html);

    return { message: 'Verification email resent successfully.' };
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError('User not found');
    if (!user.isVerified) throw new BadRequestError('Please verify your email first');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError('Incorrect password');

    // Get user type
    const userType = await UserType.findOne({ userId: user._id });
    if (!userType) throw new NotFoundError('User type not found');

    // Generate JWT token
    const token = jwt.sign({ id: user._id, type: userType.type }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user.toObject();

    return {
      token,
      user: {
        ...userData,
        userType: {
          type: userType.type,
        },
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('User not found');

    const userType = await UserType.findOne({ userId: user._id });
    if (!userType) throw new NotFoundError('User type not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user.toObject();

    return {
      ...userData,
      userType: {
        _id: userType._id,
        userId: userType.userId,
        type: userType.type,
        createdAt: userType.createdAt,
        updatedAt: userType.updatedAt,
      },
    };
  }

  /**
   * Get current user (for /me endpoint)
   */
  async getCurrentUser(userId: string) {
    return this.getUserById(userId);
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<IUser>) {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new NotFoundError('User not found');

    // Send notification email
    const html = `
      <h3>Account Update Notification</h3>
      <p>Hi ${user.fullName || 'User'},</p>
      <p>Your account details were recently updated.</p>
      <p>If you made this change, no action is needed.</p>
      <p>If you did <b>NOT</b> make this change, please reset your password or contact support immediately.</p>
      <br>
      <p>Best regards,<br>UHomes Team</p>
    `;

    await sendEmail(user.email, 'Your UHomes Account Was Updated', html);

    // Get user type for response
    const userType = await UserType.findOne({ userId: user._id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user.toObject();

    return {
      ...userData,
      userType: userType ? { type: userType.type } : undefined,
    };
  }

  /**
   * Delete user
   */
  async deleteUser(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError('User not found');

    // Delete associated UserType
    await UserType.deleteOne({ userId: id });

    // Delete all tokens associated with the user
    await Token.deleteMany({ userId: id });

    return { message: 'User deleted successfully' };
  }

  /**
   * Forgot password - send OTP
   */
  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError('User not found');

    // Delete old reset tokens for the same user
    await Token.deleteMany({ userId: user._id, typeOf: 'resetPassword' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await Token.create({
      userId: user._id,
      typeOf: 'resetPassword',
      token: otp,
      expiresAt,
    });

    const html = `
      <h3>Password Reset Request</h3>
      <p>Hi ${user.fullName || 'User'},</p>
      <p>Your OTP for password reset is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 15 minutes.</p>
      <br>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>UHomes Team</p>
    `;
    await sendEmail(user.email, 'UHomes Password Reset', html);

    return { message: 'Password reset link sent to your email.' };
  }

  /**
   * Reset password using OTP
   */
  async resetPassword(otp: string, newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) throw new BadRequestError('Passwords do not match');

    if (newPassword.length < 8)
      throw new BadRequestError('Password must be at least 8 characters long');

    // Find the token and associated user
    const tokenDoc = await Token.findOne({
      token: otp.trim(),
      typeOf: 'resetPassword',
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) throw new BadRequestError('Invalid or expired OTP');

    const user = await User.findById(tokenDoc.userId);
    if (!user) throw new NotFoundError('User not found');

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove token after use
    await tokenDoc.deleteOne();

    // Send confirmation email
    const html = `
      <h3>Password Reset Successful</h3>
      <p>Hi ${user.fullName || 'User'},</p>
      <p>Your password has been successfully reset.</p>
      <p>If you did not perform this action, please contact support immediately.</p>
    `;
    await sendEmail(user.email, 'Password Reset Confirmation', html);

    return {
      success: true,
      message: 'Password reset successfully',
      time: new Date(),
    };
  }

  /**
   * Resend password reset OTP
   */
  async resendResetToken(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError('User not found');

    // Remove old tokens
    await Token.deleteMany({ userId: user._id, typeOf: 'resetPassword' });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await Token.create({
      userId: user._id,
      typeOf: 'resetPassword',
      token: otp,
      expiresAt,
    });

    const html = `
      <h3>New Password Reset OTP</h3>
      <p>Hi ${user.fullName || 'User'},</p>
      <p>Your new OTP is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 15 minutes.</p>
    `;
    await sendEmail(user.email, 'New OTP for Password Reset', html);

    return { message: 'New OTP sent to your email.' };
  }
}

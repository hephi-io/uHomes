import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model';
import UserType from '../models/user-type.model';
import Token from '../models/token.model';
import { sendEmail } from '../utils/sendEmail';
import { sendVerificationEmail } from '../utils/verification-email';
import { TokenService } from './token.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../middlewares/error.middlewere';
import Property from '../models/property.model';
import Booking from '../models/booking.model';

interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  type: 'student' | 'agent' | 'admin';
  // Student-specific
  university?: string;
  yearOfStudy?: '100' | '200' | '300' | '400' | '500';
  // Agent-specific
  nin?: string; // National Identification Number for KYC verification
}

export class UserService {
  private tokenService = new TokenService();

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
    const { fullName, email, phoneNumber, password, type, university, yearOfStudy, nin } = data;

    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) throw new BadRequestError('Email already in use');

    // Check if phone number already exists
    const existingUserByPhone = await User.findOne({ phoneNumber });
    if (existingUserByPhone) throw new BadRequestError('Phone number already in use');

    // Validate type-specific fields
    if (type === 'student') {
      if (!university) throw new BadRequestError('University is required for students');
      if (!yearOfStudy) throw new BadRequestError('Year of study is required for students');
    }

    // Note: NIN is optional during registration - agents can verify NIN separately via /api/user/verify-nin
    // If NIN is provided during registration, validate it
    if (type === 'agent' && nin) {
      // Check if NIN already exists
      const existingUserByNIN = await User.findOne({ nin: nin.trim() });
      if (existingUserByNIN) throw new BadRequestError('NIN already in use');

      // Validate NIN format
      if (!/^\d{11}$/.test(nin.trim())) {
        throw new BadRequestError('NIN must be exactly 11 digits');
      }
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
      ...(type === 'agent' && {
        properties: [],
        totalRevenue: 0,
        ...(nin && { nin: nin.trim(), ninVerificationStatus: 'pending' }),
      }),
    };

    const user = new User(userData);
    await user.save();

    // Create UserType document
    const userType = new UserType({
      userId: user._id,
      type,
    });
    await userType.save();

    // Generate 6-digit verification code
    const verificationCode = await this.tokenService.createVerificationCode(
      String(user._id),
      email
    );

    // Sign verification URL
    const signedUrl = this.tokenService.signVerificationUrl(verificationCode, email);

    // Send verification email with code and signed URL
    await sendVerificationEmail(email, verificationCode, signedUrl, fullName);

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  /**
   * Verify user email (legacy token-based - kept for backward compatibility)
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
   * Verify account using 6-digit code
   */
  async verifyAccount(email: string, code: string) {
    try {
      // Verify the code
      const { userId, tokenId } = await this.tokenService.verifyCode(email, code);

      // Mark user as verified
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError('User not found');

      user.isVerified = true;
      await user.save();

      // Mark code as verified
      await this.tokenService.markAsVerified(tokenId);

      // Get user type
      const userType = await UserType.findOne({ userId: user._id });
      if (!userType) throw new NotFoundError('User type not found');

      // Generate JWT token (same as login)
      const token = jwt.sign({ id: user._id, type: userType.type }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
      });

      // Remove password and NIN from response (sensitive data)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, nin: __, ...userData } = user.toObject();

      return {
        token,
        user: {
          ...userData,
          userType: {
            type: userType.type,
          },
        },
        message: 'Account verified successfully',
      };
    } catch (error) {
      // If verification fails, increment attempts
      const token = await Token.findOne({
        email: email.toLowerCase(),
        token: code,
        typeOf: 'emailVerification',
        status: 'pending',
      });
      if (token) {
        await this.tokenService.incrementAttempts(String(token._id));
      }
      throw error;
    }
  }

  /**
   * Verify account via signed URL
   */
  async verifyAccountViaUrl(signedToken: string) {
    // Verify and extract code/email from signed token
    const { code, email } = this.tokenService.verifySignedUrl(signedToken);

    // Use the same verification logic
    return this.verifyAccount(email, code);
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError('User not found');

    if (user.isVerified) throw new BadRequestError('Email already verified');

    // Check rate limit (max 3 per hour)
    const canResend = await this.tokenService.checkRateLimit(email);
    if (!canResend) {
      throw new BadRequestError(
        'Too many verification requests. Please wait before requesting a new code.'
      );
    }

    // Generate new 6-digit verification code
    const verificationCode = await this.tokenService.createVerificationCode(
      String(user._id),
      email
    );

    // Sign verification URL
    const signedUrl = this.tokenService.signVerificationUrl(verificationCode, email);

    // Send verification email with code and signed URL
    await sendVerificationEmail(email, verificationCode, signedUrl, user.fullName);

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

    // Remove password and NIN from response (sensitive data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, nin: __, ...userData } = user.toObject();

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

    // Remove password and NIN from response (sensitive data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, nin: __, ...userData } = user.toObject();

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
    // If NIN is being updated, validate it
    if (data.nin) {
      // Validate NIN format
      if (!/^\d{11}$/.test(data.nin.trim())) {
        throw new BadRequestError('NIN must be exactly 11 digits');
      }

      // Check if NIN is already in use by another user
      const existingUserByNIN = await User.findOne({ nin: data.nin.trim(), _id: { $ne: id } });
      if (existingUserByNIN) throw new BadRequestError('NIN already in use');

      // Trim NIN before saving
      data.nin = data.nin.trim();
    }

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

    // Create in-app notification
    try {
      const { NotificationService } = await import('./notification.service');
      const notificationService = new NotificationService();
      await notificationService.createNotification({
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        type: 'account_updated',
        title: 'Account Updated',
        message: 'Your account details have been updated',
        relatedId: (user._id as mongoose.Types.ObjectId).toString(),
      });
    } catch (error) {
      // Notification failure shouldn't break the update
      console.error('Failed to create notification for account update:', error);
    }

    // Get user type for response
    const userType = await UserType.findOne({ userId: user._id });
    // Remove password and NIN from response (sensitive data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, nin: __, ...userData } = user.toObject();

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

    // Create in-app notification
    try {
      const { NotificationService } = await import('./notification.service');
      const notificationService = new NotificationService();
      await notificationService.createNotification({
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        type: 'password_reset',
        title: 'Password Reset',
        message: 'Your password has been reset successfully',
        relatedId: (user._id as mongoose.Types.ObjectId).toString(),
      });
    } catch (error) {
      // Notification failure shouldn't break the reset
      console.error('Failed to create notification for password reset:', error);
    }

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

  async getAgentDashboardStats(agentId: string) {
    const totalProperties = await Property.countDocuments({
      agentId: new mongoose.Types.ObjectId(agentId),
    });

    // Count available properties as the number of available rooms
    const availableRooms = await Property.countDocuments({
      agentId: new mongoose.Types.ObjectId(agentId),
      isAvailable: true,
    });

    const pendingBookings = await Booking.countDocuments({
      agent: new mongoose.Types.ObjectId(agentId),
      status: 'pending',
    });

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          agent: new mongoose.Types.ObjectId(agentId),
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return {
      totalProperties,
      availableRooms,
      pendingBookings,
      totalRevenue,
    };
  }

  /**
   * Verify NIN with document upload (KYC verification)
   */
  async verifyNIN(
    userId: string,
    nin: string,
    documentFile: Express.Multer.File
  ): Promise<{ message: string }> {
    // Validate user is an agent
    const userType = await UserType.findOne({ userId });
    if (!userType || userType.type !== 'agent') {
      throw new BadRequestError('Only agents can verify NIN');
    }

    // Validate NIN format
    if (!/^\d{11}$/.test(nin.trim())) {
      throw new BadRequestError('NIN must be exactly 11 digits');
    }

    // Check if NIN is already in use by another user
    const existingUserByNIN = await User.findOne({ nin: nin.trim(), _id: { $ne: userId } });
    if (existingUserByNIN) throw new BadRequestError('NIN already in use');

    // Upload document to Cloudinary
    const { default: cloudinary } = await import('../config/cloudinary');
    const uploadResult = await cloudinary.uploader.upload(documentFile.path, {
      resource_type: 'auto', // Supports both images and PDFs
      folder: 'nin-documents', // Organize NIN documents in a separate folder
    });

    // Update user with NIN and document
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    user.nin = nin.trim();
    user.ninDocumentUrl = uploadResult.secure_url;
    user.ninVerificationStatus = 'pending'; // Admin will verify later
    await user.save();

    // Clean up local file
    const fs = await import('fs');
    if (fs.existsSync(documentFile.path)) {
      fs.unlinkSync(documentFile.path);
    }

    return {
      message: 'NIN verification submitted successfully. Your document is under review.',
    };
  }

  /**
   * Get NIN verification status (for agents to check their status)
   */
  async getNINVerificationStatus(userId: string) {
    const user = await User.findById(userId).select('ninVerificationStatus ninDocumentUrl');
    if (!user) throw new NotFoundError('User not found');

    return {
      verificationStatus: user.ninVerificationStatus || 'pending',
      hasDocument: !!user.ninDocumentUrl,
    };
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(
    userId: string,
    imageFile: Express.Multer.File
  ): Promise<{ profilePicture: string }> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    // Upload to Cloudinary
    const { default: cloudinary } = await import('../config/cloudinary');

    // Upload new image to Cloudinary first
    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: 'image',
      folder: 'profile-pictures',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
      ],
    });

    // If user already has a profile picture, delete the old one from Cloudinary
    if (user.profilePicture) {
      try {
        // Extract public_id from the URL
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/profile-pictures/public_id.jpg
        // or: https://res.cloudinary.com/cloud_name/image/upload/profile-pictures/public_id.jpg (without version)
        const url = user.profilePicture;
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex !== -1) {
          const pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);
          // Remove version if present (format: v1234567890/)
          const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
          // Remove file extension to get public_id
          const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        // If deletion fails, continue with upload anyway (non-critical)
        console.warn('Failed to delete old profile picture:', error);
      }
    }

    // Update user with new profile picture URL
    user.profilePicture = uploadResult.secure_url;
    await user.save();

    // Clean up local file
    const fs = await import('fs');
    if (fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }

    return {
      profilePicture: user.profilePicture,
    };
  }

  /**
   * Update payment setup (bank information and invoice email)
   */
  async updatePaymentSetup(
    userId: string,
    data: {
      accountNumber?: string;
      accountName?: string;
      bank?: string;
      alternativeEmail?: string;
    }
  ) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    // Validate email format if alternative email is provided
    if (data.alternativeEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.alternativeEmail)) {
        throw new BadRequestError('Invalid email format');
      }
    }

    // Validate account number if provided (should be numeric)
    if (data.accountNumber && !/^\d+$/.test(data.accountNumber)) {
      throw new BadRequestError('Account number must contain only digits');
    }

    // Update payment fields
    if (data.accountNumber !== undefined) user.accountNumber = data.accountNumber;
    if (data.accountName !== undefined) user.accountName = data.accountName;
    if (data.bank !== undefined) user.bank = data.bank;
    if (data.alternativeEmail !== undefined) user.alternativeEmail = data.alternativeEmail;

    await user.save();

    // Get user type for response
    const userType = await UserType.findOne({ userId: user._id });
    // Remove password and NIN from response (sensitive data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, nin: __, ...userData } = user.toObject();

    return {
      ...userData,
      userType: userType ? { type: userType.type } : undefined,
    };
  }

  /**
   * Get notification preferences for a user
   */
  async getNotificationPreferences(userId: string) {
    const user = await User.findById(userId).select('notificationPreferences');
    if (!user) throw new NotFoundError('User not found');

    // Return default preferences if none exist
    const defaultPreferences = {
      email: {
        payment: true,
        booking: true,
        systemUpdates: false,
        reviewAlert: false,
      },
      inApp: {
        payment: true,
        booking: true,
        systemUpdates: true,
        reviewAlert: true,
      },
      sms: {
        payment: false,
        booking: false,
        systemUpdates: true,
        reviewAlert: false,
      },
    };

    return {
      notificationPreferences: user.notificationPreferences || defaultPreferences,
    };
  }

  /**
   * Update notification preferences for a user
   */
  async updateNotificationPreferences(
    userId: string,
    preferences: {
      email?: {
        payment?: boolean;
        booking?: boolean;
        systemUpdates?: boolean;
        reviewAlert?: boolean;
      };
      inApp?: {
        payment?: boolean;
        booking?: boolean;
        systemUpdates?: boolean;
        reviewAlert?: boolean;
      };
      sms?: {
        payment?: boolean;
        booking?: boolean;
        systemUpdates?: boolean;
        reviewAlert?: boolean;
      };
    }
  ) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    // Get current preferences or defaults
    const defaultPreferences = {
      email: {
        payment: true,
        booking: true,
        systemUpdates: false,
        reviewAlert: false,
      },
      inApp: {
        payment: true,
        booking: true,
        systemUpdates: true,
        reviewAlert: true,
      },
      sms: {
        payment: false,
        booking: false,
        systemUpdates: true,
        reviewAlert: false,
      },
    };

    const currentPreferences = (user.notificationPreferences as any) || defaultPreferences;

    // Merge new preferences with current ones
    const updatedPreferences = {
      email: {
        ...currentPreferences.email,
        ...preferences.email,
      },
      inApp: {
        ...currentPreferences.inApp,
        ...preferences.inApp,
      },
      sms: {
        ...currentPreferences.sms,
        ...preferences.sms,
      },
    };

    user.notificationPreferences = updatedPreferences as any;
    await user.save();

    // Get user type for response
    const userType = await UserType.findOne({ userId: user._id });
    // Remove password and NIN from response (sensitive data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, nin: __, ...userData } = user.toObject();

    return {
      ...userData,
      userType: userType ? { type: userType.type } : undefined,
    };
  }

  /**
   * Reset notification preferences to default values
   */
  async resetNotificationPreferences(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const defaultPreferences = {
      email: {
        payment: true,
        booking: true,
        systemUpdates: false,
        reviewAlert: false,
      },
      inApp: {
        payment: true,
        booking: true,
        systemUpdates: true,
        reviewAlert: true,
      },
      sms: {
        payment: false,
        booking: false,
        systemUpdates: true,
        reviewAlert: false,
      },
    };

    user.notificationPreferences = defaultPreferences as any;
    await user.save();

    // Get user type for response
    const userType = await UserType.findOne({ userId: user._id });
    // Remove password and NIN from response (sensitive data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, nin: __, ...userData } = user.toObject();

    return {
      ...userData,
      userType: userType ? { type: userType.type } : undefined,
    };
  }
}

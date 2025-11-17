import User, { IUser } from '../models/user.model';
import User_type from '../models/user-type.model';
import Token from '../models/token.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail';
import { sendEmailVerification } from '../template/sendEmailVerification';
import { BadRequestError, ConflictError, NotFoundError } from '../middlewares/error.middlewere';
import { SignupPayload, LoginPayload } from '../interfaces/user.payload';

export class UserService {
  async signup(payload: SignupPayload) {
    const { fullName, email, phoneNumber, password, role, university, yearOfStudy } = payload;

    if (!['Student', 'Agent', 'Admin'].includes(role)) {
      throw new BadRequestError('Invalid role');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ConflictError('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: Partial<IUser> = { fullName, email, phoneNumber, password: hashedPassword };
    if (role === 'Student') {
      if (university) userData.university = university;
      if (yearOfStudy) userData.yearOfStudy = yearOfStudy;
    }

    const user = await User.create(userData);

    await User_type.create({ userId: user._id, role });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    await Token.create({
      userId: user._id,
      role,
      typeOf: 'emailVerification',
      token: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const verificationHtml = sendEmailVerification(fullName, email, otp);
    await sendEmail(email, 'Verify your uHomes email', verificationHtml);

    return { user, otp, role };
  }

  async verifyOtp(token: string): Promise<string> {
    if (!token) throw new BadRequestError('OTP is required');

    const tokenRecord = await Token.findOne({
      token,
      typeOf: 'emailVerification',
    });

    if (!tokenRecord) throw new BadRequestError('Invalid or expired OTP');

    const user = await User.findById(tokenRecord.userId);
    if (!user) throw new NotFoundError('User not found');

    user.isVerified = true;
    await user.save();
    await Token.deleteMany({ userId: user._id, typeOf: 'emailVerification' });

    return 'OTP verified successfully';
  }

  async login(payload: LoginPayload) {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestError('Invalid credentials');

    const userRole = await User_type.findOne({ userId: user._id });
    if (!userRole) throw new NotFoundError('User role not found');

    const token = jwt.sign({ id: user._id, role: userRole.role }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return {
      user,
      role: userRole.role,
      token,
    };
  }
}

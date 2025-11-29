import User, { IUser } from '../models/user.model'
import User_type from '../models/user-type.model'
import Token from '../models/token.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/sendEmail'
import mongoose from 'mongoose'
import { sendEmailVerification, sendResendVerificationEmail,sendForgotPasswordEmail,sendPasswordResetSuccessEmail,sendResendResetOtpEmail, sendAccountUpdatedEmail } from '../template/sendEmailVerification'
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../middlewares/error.middlewere'
import { SignupPayload, LoginPayload } from '../interface/user.paload'

export class UserService {
    async signup(payload: SignupPayload) {
      const { fullName, email, phoneNumber, password, types, university, yearOfStudy } = payload

      if (!['Student', 'Agent', 'Admin'].includes(types)) {
        throw new BadRequestError('Invalid types')
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) throw new ConflictError('Email already exists')

      const hashedPassword = await bcrypt.hash(password, 10)

    let user: IUser | null = null

      try {
        const userData: Partial<IUser> = {
          fullName,
          email,
          phoneNumber,
          password: hashedPassword,
          university: types === 'Student' ? university : undefined,
          yearOfStudy: types === 'Student' ? yearOfStudy : undefined,
      }

      user = await User.create(userData)

      await User_type.create({ userId: user._id, types })

      const otp = String(Math.floor(100000 + Math.random() * 900000))

      await Token.create({
        userId: user._id,
        types,
        typeOf: 'emailVerification',
        token: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      })

      const verificationHtml = sendEmailVerification(fullName, email, otp)
      await sendEmail(email, 'Verify your uHomes email', verificationHtml)

      return { user, otp, types }
    } catch (err) {
      if (user) {
        await User.deleteOne({ _id: user._id })
        await User_type.deleteOne({ userId: user._id })
        await Token.deleteMany({ userId: user._id })
      }

      throw err
    }
  }

  async verifyOtp(token: string): Promise<string> {
    if (!token) throw new BadRequestError('OTP is required')

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

    return 'Email verified successfully';
  }

  async resendVerifyOtp(userId: string) {
  try {
    const user = await User.findById(userId)
    if (!user) throw new BadRequestError('User not found')
    if (user.isVerified) throw new BadRequestError('User already verified')

    const userType = await User_type.findOne({ userId: user._id })
    if (!userType) throw new BadRequestError('User type not found')

    await Token.deleteMany({
      userId: user._id,
      typeOf: 'emailVerification'
    })

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    await Token.create({
      userId: user._id,
      types: userType.types,
      token: otp,
      typeOf: 'emailVerification',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    })

    
    const html = sendResendVerificationEmail(user.fullName, user.email, otp)
    await sendEmail(user.email, 'Verify your email', html)

    return 'OTP resent successfully'

  } catch (err: unknown) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new BadRequestError(
        Object.values(err.errors)
          .map((e) => e.message)
          .join(', ')
      )
    }
    throw err
  }
}


  async login(payload: LoginPayload) {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestError('Invalid credentials');

    const userType = await User_type.findOne({ userId: user._id });
    if (!userType) throw new NotFoundError('User role not found');

    const token = jwt.sign({ id: user._id, types: userType.types }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return {
      user,
      types: userType.types,
      token,
    }
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email })
    if (!user) throw new NotFoundError('No account found with this email')


    const userType = await User_type.findOne({ userId: user._id })
    if (!userType) throw new BadRequestError('User type not found')


    await Token.deleteMany({ userId: user._id, typeOf: 'resetPassword' })

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    await Token.create({
      userId: user._id,
      types: userType.types,
      token: otp,
      typeOf: 'resetPassword',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    })

    const html = sendForgotPasswordEmail(user.fullName, email, otp)
    await sendEmail(email, 'Reset Password', html)

    return 'Password reset OTP sent'
  }

 async resetPassword(token: string, newPassword: string) {
    const tokenRecord = await Token.findOne({ token, typeOf: 'resetPassword' })
    if (!tokenRecord) throw new BadRequestError('Invalid or expired OTP')

    const user = await User.findById(tokenRecord.userId)
    if (!user) throw new NotFoundError('User not found')
      

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    await Token.deleteMany({ userId: user._id, typeOf: 'resetPassword' })

    const html = sendPasswordResetSuccessEmail(user.fullName, user.email)
    await sendEmail(user.email, 'Password Reset Successful', html)

    return 'Password reset successfully'
  }


  async resendResetOtp(email: string) {
    const user = await User.findOne({ email })
    if (!user) throw new NotFoundError('User not found')
    
    const userType = await User_type.findOne({userId: user.id})
     if(!userType) throw new BadRequestError('')

    await Token.deleteMany({ userId: user._id, typeOf: 'resetPassword' })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) 

    await Token.create({
      userId: user._id,
      types: userType.types,
      typeOf: 'resetPassword',
      token: otp,
      expiresAt,
    })

    // Email content
    const html =  sendResendResetOtpEmail(user.fullName, user.email, otp)

    // Send email
    await sendEmail(user.email, 'New OTP for Password Reset', html)

    return { message: 'New OTP sent to your email.' }
  }


  async getAllUsers(): Promise<IUser[]> {
    const users = await User.find().select('-password')
    if (!users.length) throw new NotFoundError('No users found')
    return users
  }


  async getUserById(userId: string): Promise<IUser> {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequestError('Invalid user ID')
    const user = await User.findById(userId).select('-password')
    if (!user) throw new NotFoundError('User not found')
    return user
  }


  async updateUser(userId: string,data: Partial<IUser>,requester: { id: string; types: string }): Promise<IUser> {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequestError('Invalid user ID')


    if (requester.id !== userId && requester.types !== 'Admin') {
      throw new UnauthorizedError('Access denied')
    }

    const user = await User.findById(userId)
    if (!user) throw new NotFoundError('User not found')

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }

    Object.assign(user, data)
    await user.save()

    const html = sendAccountUpdatedEmail(user.fullName, user.email, user.password || '')

    await sendEmail(user.email, 'Your UHomes Account Was Updated', html)

    return user
  }


  async deleteUser(userId: string, requester: { id: string; types: string }): Promise<IUser> {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequestError('Invalid user ID')

  
    if (requester.id !== userId && requester.types !== 'Admin') {
      throw new UnauthorizedError('Access denied')
    }

    const user = await User.findById(userId)
    if (!user) throw new NotFoundError('User not found')

    await User.deleteOne({ _id: userId })
    await User_type.deleteOne({ userId })
    await Token.deleteMany({ userId })

    return user
  }

}


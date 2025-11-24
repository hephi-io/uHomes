import { UserService } from '../src/service/user.service'
import User from '../src/models/user.model'
import User_type from '../src/models/user-type.model'
import Token from '../src/models/token.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../src/utils/sendEmail'
import {
  sendEmailVerification,
  sendResendVerificationEmail,
  sendForgotPasswordEmail,
  sendPasswordResetSuccessEmail,
  sendResendResetOtpEmail,
  sendAccountUpdatedEmail
} from '../src/template/sendEmailVerification'
import { SignupPayload, LoginPayload } from '../src/interface/user.paload'

// Mock email and external functions
jest.mock('../src/utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}))

jest.mock('../src/template/sendEmailVerification', () => ({
  sendEmailVerification: jest.fn().mockReturnValue('<html>verify</html>'),
  sendResendVerificationEmail: jest.fn().mockReturnValue('<html>resend</html>'),
  sendForgotPasswordEmail: jest.fn().mockReturnValue('<html>forgot</html>'),
  sendPasswordResetSuccessEmail: jest.fn().mockReturnValue('<html>success</html>'),
  sendResendResetOtpEmail: jest.fn().mockReturnValue('<html>reset otp</html>'),
  sendAccountUpdatedEmail: jest.fn().mockReturnValue('<html>account updated</html>')
}))

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

const service = new UserService()

describe('UserService', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await User.deleteMany({})
    await User_type.deleteMany({})
    await Token.deleteMany({})
  })

  test('should signup a new user', async () => {
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass')

    const payload: SignupPayload = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '07011122233',
      password: 'mypassword',
      types: 'Student',
      university: 'UniLag',
      yearOfStudy: '300'
    }

    const result = await service.signup(payload)

    expect(result.user.email).toBe(payload.email)
    expect(sendEmail).toHaveBeenCalled()
    expect(sendEmailVerification).toHaveBeenCalled()
  })

  test('should verify otp', async () => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '09000000000',
      password: '123456'
    })

    await Token.create({
      userId: user._id,
      types: 'Student',
      token: '111111',
      typeOf: 'emailVerification',
      expiresAt: new Date(Date.now() + 5000)
    })

    const msg = await service.verifyOtp('111111')
    expect(msg).toBe('Email verified successfully')
  })

  test('should resend verify otp', async () => {
    const user = await User.create({
      fullName: 'Resend User',
      email: 'resend@example.com',
      phoneNumber: '09012345678',
      password: 'password'
    })

    await User_type.create({ userId: user._id, types: 'Student' })

    const msg = await service.resendVerifyOtp(user._id.toString())
    expect(msg).toBe('OTP resent successfully')
    expect(sendResendVerificationEmail).toHaveBeenCalled()
  })

  test('should login user', async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    ;(jwt.sign as jest.Mock).mockReturnValue('jwt-token')

    const user = await User.create({
      fullName: 'Login User',
      email: 'login@example.com',
      phoneNumber: '09000000000',
      password: 'password',
      isVerified: true
    })

    await User_type.create({
      userId: user._id,
      types: 'Student'
    })

    const loginPayload: LoginPayload = { email: user.email, password: 'test' }

    const result = await service.login(loginPayload)
    expect(result.token).toBe('jwt-token')
    expect(result.types).toBe('Student')
  })

  test('should send forgot password otp', async () => {
    const user = await User.create({
      fullName: 'Forgot',
      email: 'forgot@example.com',
      phoneNumber: '1111111',
      password: 'password'
    })

    await User_type.create({ userId: user._id, types: 'Student' })

    const msg = await service.forgotPassword(user.email)
    expect(msg).toBe('Password reset OTP sent')
    expect(sendForgotPasswordEmail).toHaveBeenCalled()
  })

  test('should reset password', async () => {
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPass')

    const user = await User.create({
      fullName: 'Reset',
      email: 'reset@example.com',
      phoneNumber: '090',
      password: 'password'
    })

    await Token.create({
      userId: user._id,
      types: 'Student',
      token: '222222',
      typeOf: 'resetPassword',
      expiresAt: new Date(Date.now() + 5000)
    })

    const msg = await service.resetPassword('222222', 'newPass123')
    expect(msg).toBe('Password reset successfully')
    expect(sendPasswordResetSuccessEmail).toHaveBeenCalled()
  })

  test('should resend reset otp', async () => {
    const user = await User.create({
      fullName: 'Resend Reset',
      email: 'rr@example.com',
      phoneNumber: '090',
      password: 'password'
    })

    await User_type.create({ userId: user._id, types: 'Student' })

    const result = await service.resendResetOtp(user.email)
    expect(result.message).toBe('New OTP sent to your email.')
    expect(sendResendResetOtpEmail).toHaveBeenCalled()
  })

  test('should get all users', async () => {
    await User.create({
      fullName: 'One',
      email: 'one@example.com',
      phoneNumber: '123',
      password: 'password'
    })

    const users = await service.getAllUsers()
    expect(users.length).toBe(1)
  })

  test('should get user by id', async () => {
    const user = await User.create({
      fullName: 'FindMe',
      email: 'find@example.com',
      phoneNumber: '123',
      password: 'password'
    })

    const found = await service.getUserById(user._id.toString())
    expect(found.email).toBe(user.email)
  })

  test('should update user', async () => {
    const user = await User.create({
      fullName: 'Old Name',
      email: 'old@example.com',
      phoneNumber: '123',
      password: 'password'
    })

    const updated = await service.updateUser(
      user._id.toString(),
      { fullName: 'New Name' },
      { id: user._id.toString(), types: 'Student' }
    )

    expect(updated.fullName).toBe('New Name')
    expect(sendAccountUpdatedEmail).toHaveBeenCalled()
  })

  test('should delete user', async () => {
    const user = await User.create({
      fullName: 'Delete Me',
      email: 'del@example.com',
      phoneNumber: '999',
      password: 'password'
    })

    await User_type.create({ userId: user._id, types: 'Student' })

    const deleted = await service.deleteUser(
      user._id.toString(),
      { id: user._id.toString(), types: 'Student' }
    )

    expect(deleted.email).toBe('del@example.com')
    const stillExists = await User.findById(user._id)
    expect(stillExists).toBeNull()
  })
})

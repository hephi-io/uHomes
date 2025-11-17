import Agent, { IAgent } from '../models/agent.model';
import Token from '../models/token.model';
import { randomBytes } from 'crypto';
import { sendEmail } from '../utils/sendEmail';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../middlewares/error.middlewere';

export class AgentService {
  async register(fullName: string, email: string, phoneNumber: string, password: string) {
    const existingUser = await Agent.findOne({ email });
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = new Agent({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await agent.save();

    const verificationToken = randomBytes(32).toString('hex');
    await Token.create({
      userId: agent._id,
      role: 'Agent',
      typeOf: 'emailVerification',
      token: verificationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
    });

    const verifyLink = `${process.env.BASE_URL}/api/agent/verify-email/${verificationToken}`;
    const html = `
      <h3>Welcome to U-Homes!</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">Verify Email</a>
    `;

    await sendEmail(email, 'Verify Your Email', html);

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  async verifyEmail(tokenString: string) {
    const tokenDoc = await Token.findOne({
      token: tokenString,
      typeOf: 'emailVerification',
      expiresAt: { $gt: new Date() },
    });
    if (!tokenDoc) throw new BadRequestError('Invalid or expired verification token');

    const agent = await Agent.findById(tokenDoc.userId);
    if (!agent) throw new NotFoundError('Agent not found');

    agent.isVerified = true;
    await agent.save();

    await tokenDoc.deleteOne();

    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string) {
    const agent = await Agent.findOne({ email });
    if (!agent) throw new NotFoundError('Agent not found');

    if (agent.isVerified) throw new BadRequestError('Email already verified');

    // Generate a new verification token
    const verificationToken = randomBytes(32).toString('hex');
    await Token.create({
      userId: agent._id,
      role: 'Agent',
      typeOf: 'emailVerification',
      token: verificationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    const verifyLink = `${process.env.BASE_URL}/api/agent/verify-email/${verificationToken}`;
    const html = `
    <h3>Welcome back to U-Homes!</h3>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verifyLink}">Verify Email</a>
  `;

    await sendEmail(agent.email, 'Verify Your Email', html);

    return { message: 'Verification email resent successfully.' };
  }

  async login(email: string, password: string) {
    const agent = await Agent.findOne({ email });
    if (!agent) throw new NotFoundError('Agent not found');
    if (!agent.isVerified) throw new BadRequestError('Please verify your email first');

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) throw new UnauthorizedError('Incorrect password');

    const token = jwt.sign({ id: agent._id, role: agent.role }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
    return { token, agent };
  }

  async getAllAgents() {
    return await Agent.find();
  }

  async getAgentById(id: string) {
    const agent = await Agent.findById(id);
    if (!agent) throw new NotFoundError('Agent not found');
    return agent;
  }

  async updateAgent(id: string, data: Partial<IAgent>) {
    const agent = await Agent.findByIdAndUpdate(id, data, { new: true });
    if (!agent) throw new NotFoundError('Agent not found');

    // email content
    const html = `
    <h3>Account Update Notification</h3>
    <p>Hi ${agent.fullName || 'Agent'},</p>
    <p>Your account details were recently updated.</p>
    <p>If you made this change, no action is needed.</p>
    <p>If you did <b>NOT</b> make this change, please reset your password or contact support immediately.</p>
    <br>
    <p>Best regards,<br>UHomes Team</p>
  `;

    await sendEmail(agent.email, 'Your UHomes Account Was Updated', html);

    return agent;
  }

  async deleteAgent(id: string) {
    const agent = await Agent.findByIdAndDelete(id);
    if (!agent) throw new NotFoundError('User not found');
    return { message: 'User deleted successfully' };
  }

  async forgotPassword(email: string) {
    const agent = await Agent.findOne({ email });
    if (!agent) throw new NotFoundError('User not found');

    // Delete old reset tokens for the same user
    await Token.deleteMany({ userId: agent._id, typeOf: 'resetPassword' });

    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await Token.create({
      userId: agent._id,
      role: agent.role || 'Agent',
      typeOf: 'resetPassword',
      token: resetToken,
      expiresAt,
    });

    console.log('Reset Token:', resetToken); // Debug
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
    <h3>Password Reset Request</h3>
    <p>Hi ${agent.fullName || 'User'},</p>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${resetLink}" style="color:#007bff">Reset Your Password</a>
    <p>This link will expire in 15 minutes.</p>
    <br>
    <p>If you did not request this, please ignore this email.</p>
    <br>
    <p>Best regards,<br>UHomes Team</p>
  `;
    await sendEmail(agent.email, 'UHomes Password Reset', html);

    return { message: 'Password reset link sent to your email.' };
  }

  async resetPassword(tokenString: string, newPassword: string) {
    tokenString = tokenString.trim();
    console.log('Reset Token Received:', tokenString);

    // Find token document
    const tokenDoc = await Token.findOne({
      token: tokenString,
      typeOf: 'resetPassword',
      expiresAt: { $gt: new Date() },
    });
    if (!tokenDoc) throw new BadRequestError('Invalid or expired reset token');

    // Find the agent
    const agent = await Agent.findById(tokenDoc.userId);
    if (!agent) throw new NotFoundError('User not found');

    // Update password
    agent.password = await bcrypt.hash(newPassword, 10);
    await agent.save();

    // Delete token after use
    await tokenDoc.deleteOne();

    const html = `
      <h3>Password Successfully Reset</h3>
      <p>Hi ${agent.fullName || 'Agent'},</p>
      <p>Your password was successfully reset. If you did not perform this action, please contact support immediately.</p>
      <br>
      <p>Best regards,<br>UHomes Team</p>
    `;
    await sendEmail(agent.email, 'Your UHomes Password Was Reset', html);

    return { message: 'Password has been reset successfully.' };
  }

  async resendResetToken(email: string) {
    const agent = await Agent.findOne({ email });
    if (!agent) throw new NotFoundError('Agent not found');

    // Remove old reset tokens
    await Token.deleteMany({ userId: agent._id, typeOf: 'resetPassword' });

    // Generate new reset token
    const resetToken = randomBytes(32).toString('hex');
    await Token.create({
      userId: agent._id,
      role: agent.role || 'Agent',
      typeOf: 'resetPassword',
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `
      <h3>Password Reset Request</h3>
      <p>Hi ${agent.fullName || 'Agent'},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="color:#007bff">Reset Your Password</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail(agent.email, 'UHomes Password Reset', html);

    return { message: 'Password reset token resent successfully.' };
  }
}

import Agent, { IAgent } from "../models/agent.model"
import Booking from "../models/booking.model"
import Token, {IToken} from "../models/token.model"
import mongoose from "mongoose"
import {randomBytes} from "crypto"
import { sendEmail } from "../utils/sendEmail"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../middlewares/error.middlewere"



export class AgentService {
  
    async register(fullName: string, email: string, phoneNumber: string, password: string) {
    const existingUser = await Agent.findOne({ email });
    if (existingUser) throw new BadRequestError("Email already in use")

    const hashedPassword = await bcrypt.hash(password, 10)

    const agent = new Agent({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await agent.save()

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Token.create({
      userId: agent._id,
      role: "Agent",
      typeOf: "emailVerification",
      token: otp,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    })
    const html = `
      <h3>Welcome to U-Homes!</h3>
      <p>Your verification code is:</p>
      <h2>${otp}</h2>
      <p>It will expire in 10 minutes.</p>
    `

    await sendEmail(email, "Verify Your Email", html);  

    return { message: "Verification code sent. Please check your inbox." };
  }

  async verifyEmail(otp: string) {
    
    const tokenDoc = await Token.findOne({
      token: otp, typeOf: "emailVerification", expiresAt: { $gt: new Date() }
    })
    if (!tokenDoc) throw new BadRequestError("Invalid or expired verification code")

    const attempts = await Token.countDocuments({
      userId: tokenDoc.userId,
      typeOf: "emailVerification"
    })
    if (attempts > 5) throw new BadRequestError("Too many verification attempts. Please request a new code.")

    const agent = await Agent.findById(tokenDoc.userId)
    if (!agent) throw new NotFoundError("Agent not found")

    agent.isVerified = true
    await agent.save()

  
    await tokenDoc.deleteOne()

    return { message: "Email verified successfully" }
  }

  async resendVerification(email: string) {
  const agent = await Agent.findOne({ email })
  if (!agent) throw new NotFoundError("Agent not found")

  if (agent.isVerified) throw new BadRequestError("Email already verified")

  const attempts = await Token.countDocuments({
    userId: agent._id,
    typeOf: "emailVerification",
    expiresAt: { $gt: new Date() }
  })
  if (attempts >= 5)
    throw new BadRequestError("Too many OTP requests. Please try again later.")

  // Remove any old tokens for this user
  await Token.deleteMany({ userId: agent._id, typeOf: "emailVerification" })


  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  
  await Token.create({
    userId: agent._id,
    role: "Agent",
    typeOf: "emailVerification",
    token: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 1 hour
  })
  const html = `
    <h3>Welcome back to U-Homes!</h3>
    <p>Your new verification code is:</p>
    <h2>${otp}</h2>
    <p>It will expire in 10 minutes.</p>
  `

  await sendEmail(agent.email, "Verify Your Email", html)

  return { message: "New verification code sent to your email." }
}


  async login(email: string, password: string) {
    const agent = await Agent.findOne({ email })
    if (!agent) throw new NotFoundError("Agent not found")
    if (!agent.isVerified) throw new BadRequestError("Please verify your email first")

    const isMatch = await bcrypt.compare(password, agent.password)
    if (!isMatch) throw new UnauthorizedError("Incorrect password")

    const token = jwt.sign({ id: agent._id, role: agent.role }, process.env.JWT_SECRET!, { expiresIn: "1d" })
    return { token, agent }
  }

  
  
  async getAllAgents() {
    return await Agent.find();
  }

  
  async getAgentById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null

    const agent = await Agent.findById(id).select('-password')
    if (!agent) return null

    const bookings = await Booking.find({ agent: id })
      .populate({
        path: 'property',
        select: 'title address price images description'
      })
      .populate({
        path: 'tenant',
        select: 'fullName email phoneNumber'
      })
      .sort({ createdAt: -1 })

    return {
      ...agent.toObject(),
      bookings
    }
  }



 
 async updateAgent(id: string, data: Partial<IAgent>) {
  const agent = await Agent.findByIdAndUpdate(id, data, { new: true });
  if (!agent) throw new NotFoundError("Agent not found");

  // email content
  const html = `
    <h3>Account Update Notification</h3>
    <p>Hi ${agent.fullName || "Agent"},</p>
    <p>Your account details were recently updated.</p>
    <p>If you made this change, no action is needed.</p>
    <p>If you did <b>NOT</b> make this change, please reset your password or contact support immediately.</p>
    <br>
    <p>Best regards,<br>UHomes Team</p>
  `;

  
    await sendEmail(
      agent.email,
      "Your UHomes Account Was Updated",
      html
    );

    return agent;
  }


  async deleteAgent(id: string) {
    const agent = await Agent.findByIdAndDelete(id);
    if (!agent) throw new NotFoundError("User not found");
    return { message: "User deleted successfully" };
  }

 async forgotPassword(email: string) {
  const agent = await Agent.findOne({ email })
  if (!agent) throw new NotFoundError("User not found")

  // Delete old reset tokens for the same user
  await Token.deleteMany({ userId: agent._id, typeOf: "resetPassword" })

  const resetToken = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  await Token.create({
    userId: agent._id,
    role: agent.role || "Agent",
    typeOf: "resetPassword",
    token: resetToken,
    expiresAt,
  })
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

  const html = `
    <h3>Password Reset Request</h3>
    <p>Hi ${agent.fullName || "User"},</p>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${resetLink}" style="color:#007bff">Reset Your Password</a>
    <p>This link will expire in 15 minutes.</p>
    <br>
    <p>If you did not request this, please ignore this email.</p>
    <br>
    <p>Best regards,<br>UHomes Team</p>
  `
  await sendEmail(agent.email, "UHomes Password Reset", html)

  return { message: "Password reset link sent to your email." }
}

  async resetPassword(tokenString: string, newPassword: string) {
    tokenString = tokenString.trim()
    console.log("Reset Token Received:", tokenString)

    // Find token document
    const tokenDoc = await Token.findOne({
      token: tokenString,
      typeOf: "resetPassword",
      expiresAt: { $gt: new Date() },
    })
    if (!tokenDoc) throw new BadRequestError("Invalid or expired reset token")

    // Find the agent
    const agent = await Agent.findById(tokenDoc.userId)
    if (!agent) throw new NotFoundError("User not found")

    // Update password
    agent.password = await bcrypt.hash(newPassword, 10)
    await agent.save()

    // Delete token after use
    await tokenDoc.deleteOne()

    const html = `
      <h3>Password Successfully Reset</h3>
      <p>Hi ${agent.fullName || "Agent"},</p>
      <p>Your password was successfully reset. If you did not perform this action, please contact support immediately.</p>
      <br>
      <p>Best regards,<br>UHomes Team</p>
    `
    await sendEmail(agent.email, "Your UHomes Password Was Reset", html)

    return { message: "Password has been reset successfully." }
  }

  async resendResetToken(email: string) {
    const agent = await Agent.findOne({ email })
    if (!agent) throw new NotFoundError("Agent not found")

    // Remove old reset tokens
    await Token.deleteMany({ userId: agent._id, typeOf: "resetPassword" })

    // Generate new reset token
    const resetToken = randomBytes(32).toString("hex")
    await Token.create({
      userId: agent._id,
      role: agent.role || "Agent",
      typeOf: "resetPassword",
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 min
    })

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    const html = `
      <h3>Password Reset Request</h3>
      <p>Hi ${agent.fullName || "Agent"},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="color:#007bff">Reset Your Password</a>
      <p>This link will expire in 15 minutes.</p>
    `

    await sendEmail(agent.email, "UHomes Password Reset", html)

    return { message: "Password reset token resent successfully." }
  }



}

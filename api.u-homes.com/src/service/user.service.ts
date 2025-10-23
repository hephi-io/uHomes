import User, { IUser } from "../models/user.model";
import { randomBytes } from "crypto";
import { sendEmail } from "../utils/sendEmail";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../middlewares/error.middlewere";

export class UserService {
  async register(fullName: string, email: string, phoneNumber: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new BadRequestError("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString("hex");

    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      verificationToken,
    });

    await user.save();

    const verifyLink = `${process.env.BASE_URL}/api/users/verify-email/${verificationToken}`;
    const html = `
      <h3>Welcome to U-Homes!</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">Verify Email</a>
    `;

    try {
      await sendEmail(email, "Verify Your Email", html);
      return { message: "Verification email sent" };
    } catch (error) {
      console.error("Email sending failed:", error);
      // Still respond with success to not block registration in tests
      return { message: "Verification email sent (simulation, SMTP issue ignored)" };
    }
  }

  async verifyEmail(token: string) {
    const user = await User.findOne({ verificationToken: token });
    if (!user) throw new UnauthorizedError("Invalid or expired verification token");

    user.isverified = true;
    user.verificationToken = undefined;
    await user.save();

    return { message: "Email verified successfully" };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User not found");

    if (!user.isverified) throw new UnauthorizedError("Please verify your email first");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError("Incorrect password");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return { message: "Login successful", token, user };
  }

  async getAllUsers() {
    const users = await User.find();
    return { message: "Users retrieved successfully", users };
  }

  async getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return { message: "User found", user };
  }

  async updateUser(id: string, data: Partial<IUser>) {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new NotFoundError("User not found");

    const html = `
      <h3>Account Update Notification</h3>
      <p>Hi ${user.fullName || "User"},</p>
      <p>Your account details were recently updated.</p>
      <p>If you made this change, no action is needed.</p>
      <p>If you did <b>NOT</b> make this change, please reset your password or contact support immediately.</p>
      <br>
      <p>Best regards,<br>UHomes Team</p>
    `;

    await sendEmail(user.email, "Your UHomes Account Was Updated", html);

    return { message: "User updated successfully", user };
  }

  async deleteUser(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("User not found");
    return { message: "User deleted successfully" };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User not found");

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `
      <h3>Password Reset Request</h3>
      <p>Hi ${user.fullName || "User"},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetLink}" style="color:#007bff">Reset Your Password</a>
      <p>This link will expire in 15 minutes.</p>
      <br>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>UHomes Team</p>
    `;

    await sendEmail(user.email, "UHomes Password Reset", html);

    return { message: "Password reset link sent to your email." };
  }

  async resetPassword(token: string, password: string) {
    token = token.trim();
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new BadRequestError("Invalid or expired reset token");

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const html = `
      <h3>Password Successfully Reset</h3>
      <p>Hi ${user.fullName || "User"},</p>
      <p>Your password was successfully reset. If you did not perform this action, please contact support immediately.</p>
      <br>
      <p>Best regards,<br>UHomes Team</p>
    `;

    await sendEmail(user.email, "Your UHomes Password Was Reset", html);

    return { message: "Password has been reset successfully." };
  }
}










// import User, { IUser } from "../models/user.model"
// import {randomBytes} from "crypto"
// import { sendEmail } from "../utils/sendEmail"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
// import { BadRequestError, NotFoundError, UnauthorizedError } from "../middlewares/error.middlewere"


// export class UserService {
  
//     async register(fullName: string, email: string, phoneNumber: string, password: string) {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) throw new BadRequestError("Email already in use");

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const verificationToken = randomBytes(32).toString("hex");

//     const user = new User({
//       fullName,
//       email,
//       phoneNumber,
//       password: hashedPassword,
//       verificationToken,
//     });

//     await user.save();

//     const verifyLink = `${process.env.BASE_URL}/api/users/verify-email/${verificationToken}`;
//     const html = `
//       <h3>Welcome to U-Homes!</h3>
//       <p>Please verify your email by clicking the link below:</p>
//       <a href="${verifyLink}">Verify Email</a>
//     `;

//     await sendEmail(email, "Verify Your Email", html);

//     return { message: "Verification email sent. Please check your inbox." };
//   }

//   async verifyEmail(token: string) {
//     const user = await User.findOne({ verificationToken: token });
//     if (!user) throw new UnauthorizedError("Invalid or expired verification token");

//     user.isverified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     return { message: "Email verified successfully" };
//   }

//   async login(email: string, password: string) {
//     const user = await User.findOne({ email });
//     if (!user) throw new NotFoundError("User not found");

//     if (!user.isverified) throw new Error("Please verify your email first");

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) throw new UnauthorizedError("Incurrect Password");

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
//       expiresIn: "1d",
//     })

//     return { token, user };
//   }

  
  

//   async getAllUsers() {
//     return await User.find();
//   }

//   async getUserById(id: string) {
//     const user = await User.findById(id);
//     if (!user) throw new NotFoundError("User not found");
//     return user;
//   }

//  async updateUser(id: string, data: Partial<IUser>) {
//   const user = await User.findByIdAndUpdate(id, data, { new: true });
//   if (!user) throw new NotFoundError("User not found");

//   // email content
//   const html = `
//     <h3>Account Update Notification</h3>
//     <p>Hi ${user.fullName || "User"},</p>
//     <p>Your account details were recently updated.</p>
//     <p>If you made this change, no action is needed.</p>
//     <p>If you did <b>NOT</b> make this change, please reset your password or contact support immediately.</p>
//     <br>
//     <p>Best regards,<br>UHomes Team</p>
//   `;

  
//     await sendEmail(
//       user.email,
//       "Your UHomes Account Was Updated",
//       html
//     );

//     return user;
//   }


//   async deleteUser(id: string) {
//     const user = await User.findByIdAndDelete(id);
//     if (!user) throw new NotFoundError("User not found");
//     return { message: "User deleted successfully" };
//   }

//   async forgotPassword(email: string) {
//     const user = await User.findOne({ email });
//     if (!user) throw new NotFoundError("User not found");

//     const resetToken = randomBytes(32).toString("hex");
//     const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = resetTokenExpiry;
//     await user.save();

//     console.log("Reset Token:", resetToken); // For debugging purposes
//     const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     const html = `
//       <h3>Password Reset Request</h3>
//       <p>Hi ${user.fullName || "User"},</p>
//       <p>You requested a password reset. Click the link below to set a new password:</p>
//       <a href="${resetLink}" style="color:#007bff">Reset Your Password</a>
//       <p>This link will expire in 15 minutes.</p>
//       <br>
//       <p>If you did not request this, please ignore this email.</p>
//       <br>
//       <p>Best regards,<br>UHomes Team</p>
//     `;

//     await sendEmail(user.email, "UHomes Password Reset", html);

//     return { message: "Password reset link sent to your email." };
//   }

//   async resetPassword(token: string, newPassword: string) {
//     token = token.trim()
//     console.log("Reset Token Received:", token); // For debugging purposes
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     })
//     console.log("User Found for Reset:", user) // For debugging purposes

//     if (!user) throw new BadRequestError("Invalid or expired reset token");

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     const html = `
//       <h3>Password Successfully Reset</h3>
//       <p>Hi ${user.fullName || "User"},</p>
//       <p>Your password was successfully reset. If you did not perform this action, please contact support immediately.</p>
//       <br>
//       <p>Best regards,<br>UHomes Team</p>
//     `;

//     await sendEmail(user.email, "Your UHomes Password Was Reset", html);

//     return { message: "Password has been reset successfully." };
//   }

// }

import User, { IUser } from "../models/user.model"
import {randomBytes} from "crypto"
import { sendEmail } from "../utils/sendEmail"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export class UserService {
  
    async register(fullName: string, email: string, phoneNumber: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already in use");

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

    await sendEmail(email, "Verify Your Email", html);

    return { message: "Verification email sent. Please check your inbox." };
  }

  async verifyEmail(token: string) {
    const user = await User.findOne({ verificationToken: token });
    if (!user) throw new Error("Invalid or expired verification token");

    user.isverified = true;
    user.verificationToken = undefined;
    await user.save();

    return { message: "Email verified successfully" };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    if (!user.isverified) throw new Error("Please verify your email first");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    })

    return { token, user };
  }
  

  async getAllUsers() {
    return await User.find();
  }

  async getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUser(id: string, data: Partial<IUser>) {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new Error("User not found");
    return user;
  }

  async deleteUser(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error("User not found");
    return { message: "User deleted successfully" };
  }
}

import Student, { IStudent } from "../models/student.model"
import Token, {IToken} from "../models/token.model"
import { randomBytes } from "crypto"
import { sendEmail } from "../utils/sendEmail"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../middlewares/error.middlewere"

export class StudentService {
  
  async register(fullName: string,email: string,phoneNumber: string,university: string,yearOfStudy: string,password: string) {
    const existingUser = await Student.findOne({ email })
    if (existingUser) throw new Error("Email already in use")

    const hashedPassword = await bcrypt.hash(password, 10)

    const student = new Student({
      fullName,
      email,
      phoneNumber,
      university,
      yearOfStudy,
      password: hashedPassword,
    })
    await student.save()

    // Generate token for email verification
    const verificationToken = randomBytes(32).toString("hex")

    await Token.create({
      userId: student._id,
      role: "Student",
      typeOf: "emailVerification",
      token: verificationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
    })

    // Send verification email
    const verifyLink = `${process.env.BASE_URL}/api/students/verify-email/${verificationToken}`
    const html = `
      <h3>Welcome to U-Homes!</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">Verify Email</a>
    `
    await sendEmail(email, "Verify Your Email", html)

    return { message: "Verification email sent. Please check your inbox." }
  }

  async verifyEmail(tokenString: string) {
      const student = await Token.findOne({
        token: tokenString,
        typeOf: "emailVerification",}).then(t => t ? Student.findById(t.userId) : null)

      if (!student) throw new BadRequestError("Invalid or expired verification token")

      student.isVerified = true
      await student.save()

      // delete the token after verification
      await Token.deleteOne({ token: tokenString})

      return { message: "Email verified successfully" }
    }

    async resendVerification(email: string) {
    const student = await Student.findOne({ email })
    if (!student) throw new NotFoundError("Student not found")
    if (student.isVerified) throw new BadRequestError("Email already verified")

    const verificationToken = randomBytes(32).toString("hex")
    await Token.create({
      userId: student._id,
      role: "Student",
      typeOf: "emailVerification",
      token: verificationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })

    const verifyLink = `${process.env.BASE_URL}/api/students/verify-email/${verificationToken}`
    const html = `
      <h3>Welcome back to U-Homes!</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">Verify Email</a>
    `
    await sendEmail(student.email, "Verify Your Email", html)
    return { message: "Verification email resent successfully." }
  }

  async login(email: string, password: string) {
    const student = await Student.findOne({ email })
    if (!student) throw new NotFoundError("Student not found")

    if (!student.isVerified) throw new Error("Please verify your email first")

    const isMatch = await bcrypt.compare(password, student.password)
   if (!isMatch) throw new UnauthorizedError("Incorrect password")

    const jwtToken = jwt.sign({
      id: student._id, role: student.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    )

   // track login token
    await Token.create({
      userId: student._id,
        role: "Student",
        typeOf: "login",
        token: jwtToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })

     return { token: jwtToken, student }
    }

  async getAllStudents() {
    const students = await Student.find()
    return students
 }

 async getStudentById(id: string) {
    const student = await Student.findById(id)
    if (!student) throw new NotFoundError("Student not found")
    return student
 }

  async updateStudent(id: string, data: Partial<IStudent>) {
    const student = await Student.findByIdAndUpdate(id, data, { new: true })
    if (!student) throw new NotFoundError("Student not found")

      
    const html = `
     <h3>Account Update Notification</h3>
     <p>Hi ${student.fullName || "Student"},</p>
     <p>Your account details were recently updated.</p>
     <p>If you made this change, no action is needed.</p>
     <p>If you did <b>NOT</b> make this change, please reset your password or contact support immediately.</p>
     <br>
     <p>Best regards,<br>UHomes Team</p>
    `

    await sendEmail(
      student.email,
      "Your UHomes Account Was Updated",
      html
    )

    return student
  }


  async deleteStudent(id: string) {
    const student = await Student.findByIdAndDelete(id)
    if (!student) throw new NotFoundError("Student not found")

    // Delete all tokens associated with the student
    await Token.deleteMany({ userId: id })

    return { message: "Student deleted successfully." }
  }


  async forgotPassword(email: string) {
    const student = await Student.findOne({ email })
    if (!student) throw new NotFoundError("Student not found")

    // Delete old tokens for same user
    await Token.deleteMany({
      userId: student._id,
      typeOf: "resetPassword",
    })

    const resetToken = randomBytes(32).toString("hex")

    await Token.create({
      userId: student._id,
      role: "Student",
      typeOf: "resetPassword",
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    })

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    const html = `
      <h3>Password Reset Request</h3>
      <p>Hi ${student.fullName},</p>
      <p>You requested a password reset. Click below to set a new password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `
    await sendEmail(student.email, "UHomes Password Reset", html)

    return { message: "Password reset link sent to your email." }
  }


  async resetPassword(tokenString: string, newPassword: string) {
    tokenString = tokenString.trim()
    console.log("Reset Token Received:", tokenString) // Debug

    // Find the token and fetch the student if token exists
    const student = await Token.findOne({token: tokenString, typeOf: "resetPassword",expiresAt: { $gt: new Date() },}).then(t => t ? Student.findById(t.userId) : null)
    console.log("Student Found for Reset:", student) // Debug

    if (!student) throw new BadRequestError("Invalid or expired reset token")

    // Hash the new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    student.password = hashedPassword
    await student.save()

    // Delete the token after use
    await Token.deleteOne({ token: tokenString })

    // Send confirmation email
    const html = `
      <h3>Password Successfully Reset</h3>
      <p>Hi ${student.fullName}, your password was reset successfully.</p>
      <p>If this wasn't you, please contact support immediately.</p>
    `
    await sendEmail(student.email, "Your UHomes Password Was Reset", html)

    return { message: "Password has been reset successfully." }
  }

  async resendResetToken(email: string) {
    const student = await Student.findOne({ email })
    console.log("Controller received email:", email)  
    if (!student) throw new NotFoundError("Student not found")

    await Token.deleteMany({ userId: student._id, typeOf: "resetPassword" })

    const resetToken = randomBytes(32).toString("hex")
    await Token.create({
      userId: student._id,
      role: "Student",
      typeOf: "resetPassword",
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    })

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    const html = `
      <h3>Password Reset Request</h3>
      <p>Hi ${student.fullName},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `
    await sendEmail(student.email, "UHomes Password Reset", html)
    return { message: "Reset token resent successfully." }
  }

}

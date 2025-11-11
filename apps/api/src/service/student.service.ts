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
 
    const { password: _, ...studentDataWithoutPassword } = student.toObject()
    
    return { token: jwtToken, student: studentDataWithoutPassword }

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

  // Delete any previous OTPs for this user
  await Token.deleteMany({ userId: student._id, typeOf: "resetPassword" })

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  await Token.create({
    userId: student._id,
    role: "Student",
    typeOf: "resetPassword",
    token: otp,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  })

  const html = `
    <h3>Password Reset Request</h3>
    <p>Hi ${student.fullName},</p>
    <p>Use the OTP below to reset your password. It expires in 15 minutes.</p>
    <h2>${otp}</h2>
    <p>If you didn't request this, please ignore this email.</p>
  `
  await sendEmail(student.email, "UHomes Password Reset OTP", html)

  return { message: "OTP sent to your email." }
}

async resetPassword(otp: string, newPassword: string, confirmPassword: string) {

  if (newPassword !== confirmPassword)
    throw new BadRequestError("Passwords do not match")

  if (newPassword.length < 8)
    throw new BadRequestError("Password must be at least 8 characters long")

  // Find the token and associated student
  const tokenDoc = await Token.findOne({
    token: otp.trim(),
    typeOf: "resetPassword",
    expiresAt: { $gt: new Date() }
  })

  if (!tokenDoc) throw new BadRequestError("Invalid or expired OTP")

   const student = await Student.findById(tokenDoc.userId)
   if (!student) throw new NotFoundError("User not found")

    console.log("Token userId:", tokenDoc.userId)
    console.log("Student _id:", student._id)


  // Update password
  student.password = await bcrypt.hash(newPassword, 10)
  await student.save()

  // Remove token after use
  await tokenDoc.deleteOne()

  // Send confirmation email
  const html = `
    <h3>Password Reset Successful</h3>
    <p>Hi ${student.fullName || "Agent"},</p>
    <p>Your password has been successfully reset.</p>
    <p>If you did not perform this action, please contact support immediately.</p>
  `
  await sendEmail(student.email, "Password Reset Confirmation", html)

  return {
    success: true,
    message: "Password reset successfully",
    time: new Date()
  }
}


  async resendResetToken(email: string) {
    const student = await Student.findOne({ email })
    if (!student) throw new NotFoundError("Student not found")

    await Token.deleteMany({ userId: student._id, typeOf: "resetPassword" })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await Token.create({
      userId: student._id,
      role: "Student",
      typeOf: "resetPassword",
      token: otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    })

    const html = `
      <h3>Password Reset Request</h3>
      <p>Hi ${student.fullName},</p>
      <p>Here’s your new OTP for password reset:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 15 minutes.</p>
    `
    await sendEmail(student.email, "UHomes Password Reset OTP", html)

    return { message: "A new OTP has been sent to your email." }
  }

  
}

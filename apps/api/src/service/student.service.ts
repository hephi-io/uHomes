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
  
  async register(fullName: string, email: string, phoneNumber: string, university: string, yearOfStudy: string, password: string) {
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

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  await Token.create({
    userId: student._id,
    role: "Student",
    typeOf: "emailVerification",
    token: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
  })

  // Send OTP via email
  const html = `
    <h3>Welcome to U-Homes!</h3>
    <p>Your verification OTP is:</p>
    <h2>${otp}</h2>
    <p>It will expire in 10 minutes.</p>
  `
  await sendEmail(email, "Verify Your Email", html)

  return { message: "Verification OTP sent. Please check your inbox." }
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
 
     const student = await Student.findById(tokenDoc.userId)
     if (!student) throw new NotFoundError("Student not found")
 
     student.isVerified = true
     await student.save()
 
   
     await tokenDoc.deleteOne()
 
     return { message: "Email verified successfully" }
   }


  async resendVerification(email: string) {
  const student = await Student.findOne({ email })
  if (!student) throw new NotFoundError("Student not found")

  if (student.isVerified)
    throw new BadRequestError("Email already verified")

  // Limit how many OTPs can be requested before expiry
  const attempts = await Token.countDocuments({
    userId: student._id,
    typeOf: "emailVerification",
    expiresAt: { $gt: new Date() }
  })
  if (attempts >= 5)
    throw new BadRequestError("Too many OTP requests. Please try again later.")

  // Clear previous OTPs
  await Token.deleteMany({
    userId: student._id,
    typeOf: "emailVerification"
  })

  // Generate new OTP (6 digits)
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  await Token.create({
    userId: student._id,
    role: "Student",
    typeOf: "emailVerification",
    token: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
  })

  // Send OTP via email
  const html = `
    <h3>Welcome to U-Homes!</h3>
    <p>Your verification code is:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 10 minutes.</p>
  `
  await sendEmail(email, "Your U-Homes Verification Code", html)

  return { message: "Verification code sent successfully." }
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

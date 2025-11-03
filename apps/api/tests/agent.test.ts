import request from "supertest"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import app from "../src/app"
import Agent, { IAgent } from "../src/models/agent.model"
import { AgentService } from "../src/service/agent.service"
import Token from "../src/models/token.model"
import { sendEmail } from "../src/utils/sendEmail"
import {randomBytes} from "crypto"
import { NotFoundError, BadRequestError } from "../src/middlewares/error.middlewere"

// Mock email utility
jest.mock("../src/utils/sendEmail", () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}))

const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>


let agentService = new AgentService

// Helper to create + log in verified agent
const createAndLoginAgent = async (): Promise<{ token: string; agentId: string }> => {
  const hashedPassword = await bcrypt.hash("Password123", 10)

  const agent = (await Agent.create({
    fullName: "Test Agent",
    email: `${Date.now()}@example.com`,
    phoneNumber: "08000000000",
    password: hashedPassword,
    isVerified: true
  })) as IAgent & { _id: mongoose.Types.ObjectId }

  const loginRes = await request(app)
    .post("/api/agent/login")
    .send({ email: agent.email, password: "Password123" })

  if (!loginRes.body?.data?.token) throw new Error("Login failed — no token returned")

  return { token: loginRes.body.data.token, agentId: agent._id.toString() }
}

// ------------------ AUTH & VERIFICATION TESTS ------------------
describe("Agent Registration, Verification, and Authentication", () => {
  it("should register a new agent and send verification email", async () => {
    const res = await request(app)
      .post("/api/agent/register")
      .send({
        fullName: "John Doe",
        email: "john@example.com",
        phoneNumber: "08123456789",
        password: "Password123"
      })

    expect(res.status).toBe(201)
    expect(res.body.data.message).toMatch(/Verification email sent/i)

    const agent = await Agent.findOne({ email: "john@example.com" })
    expect(agent).not.toBeNull()
    expect(agent?.isVerified).toBe(false)

    const token = await Token.findOne({ userId: agent?._id })
    expect(token).not.toBeNull()
  })

  it("should verify email successfully using valid token", async () => {
    const agent = await Agent.create({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "08098765432",
      password: "hashedpass"
    })

    const token = await Token.create({
      userId: agent._id,
      role: "Agent",
      typeOf: "emailVerification",
      token: "validtoken",
      expiresAt: new Date(Date.now() + 3600000)
    })

    const res = await request(app).get(`/api/agent/verify-email/${token.token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.message).toMatch(/Email verified successfully/i)

    const updatedAgent = await Agent.findById(agent._id)
    expect(updatedAgent?.isVerified).toBe(true)
    expect(await Token.findOne({ token: token.token })).toBeNull()
  })

  it("should resend verification email if not verified", async () => {
    await Agent.create({
      fullName: "Unverified Agent",
      email: "unverified@example.com",
      phoneNumber: "08099998888",
      password: "hashedpass",
      isVerified: false
    })

    const res = await request(app)
      .post("/api/agent/resend-verification")
      .send({ email: "unverified@example.com" })

    expect(res.status).toBe(200)
    expect(res.body.data.message).toMatch(/Verification email resent successfully/i)

    const agent = await Agent.findOne({ email: "unverified@example.com" })
    expect(await Token.findOne({ userId: agent?._id })).not.toBeNull()
  })

  it("should login successfully after email verification", async () => {
    await Agent.create({
      fullName: "Login Agent",
      email: "login@example.com",
      phoneNumber: "08100001111",
      password: await bcrypt.hash("Password123", 10),
      isVerified: true
    })

    const res = await request(app)
      .post("/api/agent/login")
      .send({ email: "login@example.com", password: "Password123" })

    expect(res.status).toBe(200)
    expect(res.body.data.token).toBeDefined()
  })
})

// ------------------ PASSWORD RESET TESTS ------------------

describe("AgentService", () => {
  describe("forgotPassword", () => {
    it("should create a reset token and send email", async () => {
      const agent = await Agent.create({
       email: "test@example.com", 
       fullName: "Test User",
       password: "somePassword123",
       phoneNumber: "08123456789",
       role: "Agent"
      })

      const result = await agentService.forgotPassword(agent.email)
      expect(result.message).toBe("Password reset link sent to your email.")
      expect(sendEmail).toHaveBeenCalled()
      const tokenDoc = await Token.findOne({ userId: agent._id })
      expect(tokenDoc).not.toBeNull()
    })

    it("should throw NotFoundError for non-existing email", async () => {
      await expect(agentService.forgotPassword("noone@example.com"))
        .rejects
        .toThrow(NotFoundError)
    })
  })

  describe("resetPassword", () => {
    it("should reset password for valid token", async () => {
      const agent = await Agent.create({
          email: "resend@example.com",
          fullName: "Resend User",
          password: "resendPass123",
          phoneNumber: "08123456781",
          role: "Agent"
        })

      const tokenString = randomBytes(32).toString("hex")

      await Token.create({
        userId: agent._id,
        typeOf: "resetPassword",
        token: tokenString,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        role: agent.role || "Agent"
      })

      const result = await agentService.resetPassword(tokenString, "newPass123")
      expect(result.message).toBe("Password has been reset successfully.")

      const updatedAgent = await Agent.findById(agent._id)
      const isMatch = await bcrypt.compare("newPass123", updatedAgent!.password)
      expect(isMatch).toBe(true)

      const tokenDoc = await Token.findOne({ token: tokenString })
      expect(tokenDoc).toBeNull()
    })

    it("should throw BadRequestError for invalid token", async () => {
      await expect(agentService.resetPassword("invalidtoken", "newPass"))
        .rejects
        .toThrow(BadRequestError)
    })
  })

  describe("resendResetToken", () => {
    it("should resend a reset token", async () => {
      const agent = await Agent.create({ 
        email: "resend@example.com", 
        fullName: "Resend User", 
        password: "password123", 
        phoneNumber: "08123456799", 
        role: "Agent"
      })
      const result = await agentService.resendResetToken(agent.email)
      expect(result.message).toBe("Password reset token resent successfully.")
      expect(mockedSendEmail).toHaveBeenCalled()
    })

    it("should throw NotFoundError for non-existing agent", async () => {
      await expect(agentService.resendResetToken("unknown@example.com"))
        .rejects
        .toThrow(NotFoundError)
    })
  })
})

// ------------------ CRUD TESTS ------------------
describe("Agent CRUD Operations", () => {
  let token: string
  let agentId: string

  beforeEach(async () => {
    const result = await createAndLoginAgent()
    token = result.token
    agentId = result.agentId
  })

  it("should get all agents", async () => {
    const res = await request(app)
      .get("/api/agent")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it("should get one agent", async () => {
    const res = await request(app)
      .get(`/api/agent/${agentId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data._id).toBe(agentId)
  })

  it("should update an agent", async () => {
    const res = await request(app)
      .put(`/api/agent/${agentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ fullName: "Updated Agent" })

    expect(res.status).toBe(200)
    expect(res.body.data.fullName).toBe("Updated Agent")
  })

  it("should delete an agent", async () => {
    const res = await request(app)
      .delete(`/api/agent/${agentId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.message).toMatch(/deleted successfully/i)
    expect(await Agent.findById(agentId)).toBeNull()
  })
})

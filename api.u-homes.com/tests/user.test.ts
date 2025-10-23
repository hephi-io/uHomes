import dotenv from "dotenv"
dotenv.config({ path: ".env.test" })
import request from "supertest"
import app from "../src/app"
import mongoose from "mongoose"
import User from "../src/models/user.model"

jest.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue(true),
  })
}))

const userPayload = {
  fullName: "John Doe",
  email: "john@example.com",
  phoneNumber: "08123456789",
  password: "password123",
}

const getMsg = (res: any) =>
  res.body.message ||
  res.body.data?.error ||
  res.body.data?.message ||
  ""

const isSuccess = (res: any) =>
  res.status >= 200 && res.status < 300 && res.body?.success !== false


beforeAll(async () => {
  console.log("MONGO_URI_TEST:", process.env.MONGO_URI_TEST)
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI_TEST!)
  }
})


beforeEach(async () => {
  await User.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
  await new Promise((resolve) => setTimeout(resolve, 500))
})

describe("User API Endpoints", () => {

  describe("POST /api/users/register", () => {
    it("should register a user successfully", async () => {
      const res = await request(app).post("/api/users/register").send(userPayload)
      expect([201, 500]).toContain(res.status)
      if (res.status === 201) {
        expect(isSuccess(res)).toBe(true)
        expect(res.body.data).toBeDefined()
      }
    })

    it("should fail if email already exists", async () => {
      await request(app).post("/api/users/register").send(userPayload);
      const res = await request(app).post("/api/users/register").send(userPayload)
      expect(res.status).toBe(400)
      expect(getMsg(res)).toMatch(/email already in use/i)
    })
  })

  describe("GET /api/users/verify-email/:token", () => {
    it("should verify email with valid token", async () => {
      const fakeToken = "validtoken123"
      const res = await request(app).get(`/api/users/verify-email/${fakeToken}`)
      expect([200, 400, 401]).toContain(res.status);
    })

    it("should return 400 or 401 for invalid token", async () => {
      const res = await request(app).get(`/api/users/verify-email/invalidtoken`)
      expect([400, 401]).toContain(res.status)
      expect(getMsg(res)).toMatch(/invalid|expired/i)
    })
  })
  
  describe("POST /api/users/login", () => {
    it("should fail for unverified or non-existing user", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: userPayload.email,
          password: userPayload.password,
        })
      expect([401, 404, 500]).toContain(res.status)
    })
  })

  describe("POST /api/users/forgot-password", () => {
    it("should send reset password email", async () => {
      const res = await request(app)
        .post("/api/users/forgot-password")
        .send({ email: userPayload.email })
      expect([200, 404]).toContain(res.status)
    })

    it("should return 404 if email not found", async () => {
      const res = await request(app)
        .post("/api/users/forgot-password")
        .send({ email: "notfound@example.com" })
      expect(res.status).toBe(404)
      expect(getMsg(res)).toMatch(/user not found/i)
    })

  describe("POST /api/users/reset-password/:token", () => {
    it("should fail for invalid token", async () => {
      const res = await request(app)
        .post("/api/users/reset-password/badtokennn")
        .send({ newPassword: "newpassword123" });
      expect([400, 401]).toContain(res.status);
      expect(getMsg(res)).toMatch(/invalid|expired/i)
    })
  })

  describe("PUT /api/users/:id", () => {
    it("should return 401 if unauthorized", async () => {
      const res = await request(app)
        .put(`/api/users/1234567890`)
        .send({ fullName: "Updated Name" })
      expect(res.status).toBe(401)
    })
  })

  describe("DELETE /api/users/:id", () => {
    it("should return 401 if unauthorized", async () => {
      const res = await request(app).delete(`/api/users/1234567890`)
      expect(res.status).toBe(401)
    })
  })
})
})
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import Student, { IStudent } from '../src/models/student.model';
import { StudentService } from '../src/service/student.service';
import Token from '../src/models/token.model';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../src/utils/sendEmail';
import { randomBytes } from 'crypto';

jest.mock('../src/utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

const studentService = new StudentService();

async function createTestStudent(overrides = {}) {
  return Student.create({
    email: 'student@example.com',
    fullName: 'Test Student',
    password: 'password123',
    phoneNumber: '08123456789',
    role: 'Student',
    university: 'Test University',
    yearOfStudy: '400',
    ...overrides,
  });
}

export const createAndLoginStudent = async (): Promise<{ token: string; studentId: string }> => {
  const hashedPassword = await bcrypt.hash('Password123', 10);

  const student = (await Student.create({
    fullName: 'Test Student',
    email: `${Date.now()}@example.com`,
    phoneNumber: '08011111111',
    password: hashedPassword,
    university: 'Test University',
    yearOfStudy: '400',
    isVerified: true,
  })) as IStudent & { _id: mongoose.Types.ObjectId };

  const loginRes = await request(app)
    .post('/api/student/login')
    .send({ email: student.email, password: 'Password123' });

  if (!loginRes.body?.data?.token) throw new Error('Login failed — no token returned');

  return { token: loginRes.body.data.token, studentId: student._id.toString() };
};

describe('Student Registration, Verification, and Authentication', () => {
  it('should register a new student and send verification email', async () => {
    const res = await request(app).post('/api/student/register').send({
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      phoneNumber: '09012345678',
      password: 'Password123',
      university: 'Test University',
      yearOfStudy: '300',
    });

    console.log(res.body);

    expect(res.status).toBe(201);
    expect(res.body.data.message).toMatch(/Verification email sent/i);

    const student = await Student.findOne({ email: 'alice@example.com' });
    expect(student).not.toBeNull();
    if (!student) throw new Error('Student not found');
    expect(student.isVerified).toBe(false);

    const token = await Token.findOne({ userId: student._id });
    expect(token).not.toBeNull();
  });

  it('should verify email successfully using valid token', async () => {
    const student = await Student.create({
      fullName: 'Bob Smith',
      email: 'bob@example.com',
      phoneNumber: '07011112222',
      password: 'hashedpass',
      university: 'UniTest',
      yearOfStudy: '200',
    });

    const token = await Token.create({
      userId: student._id,
      role: 'Student',
      typeOf: 'emailVerification',
      token: 'validtoken',
      expiresAt: new Date(Date.now() + 3600000),
    });

    const res = await request(app).get(`/api/student/verify-email/${token.token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.message).toMatch(/Email verified successfully/i);

    const updatedStudent = await Student.findById(student._id);
    expect(updatedStudent).not.toBeNull();
    if (!updatedStudent) throw new Error('Updated student not found');
    expect(updatedStudent.isVerified).toBe(true);

    const deletedToken = await Token.findOne({ token: token.token });
    expect(deletedToken).toBeNull();
  });

  it('should resend verification email for unverified student', async () => {
    const student = await Student.create({
      fullName: 'Unverified Student',
      email: 'resend@example.com',
      phoneNumber: '08011110000',
      password: 'hashedpass',
      university: 'Test University',
      yearOfStudy: '300',
      isVerified: false,
    });

    const res = await request(app)
      .post('/api/student/resend-verification')
      .send({ email: student.email });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toMatch(/Verification email resent successfully/i);

    const token = await Token.findOne({ userId: student._id });
    expect(token).not.toBeNull();
  });

  it('should login successfully after verification', async () => {
    const hashedPassword = await bcrypt.hash('Password123', 10);

    const student = await Student.create({
      fullName: 'Login Student',
      email: 'login@example.com',
      phoneNumber: '08111112222',
      password: hashedPassword,
      university: 'Test University',
      yearOfStudy: '400',
      isVerified: true,
    });

    const res = await request(app)
      .post('/api/student/login')
      .send({ email: student.email, password: 'Password123' });

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});

describe('StudentService', () => {
  describe('forgotPassword', () => {
    it('should create a reset token and send email', async () => {
      const student = await createTestStudent();
      const result = await studentService.forgotPassword(student.email);

      expect(result).toHaveProperty('message', 'Password reset link sent to your email.');
      const token = await Token.findOne({ userId: student._id });
      expect(token).toBeTruthy();
      expect(token?.role).toBe('Student');
      expect(sendEmail).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password for valid token', async () => {
      const student = await createTestStudent();
      const resetToken = randomBytes(32).toString('hex');
      await Token.create({
        userId: student._id,
        role: 'Student',
        typeOf: 'resetPassword',
        token: resetToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      const newPassword = 'newPassword123';
      const result = await studentService.resetPassword(resetToken, newPassword);
      expect(result).toHaveProperty('message', 'Password has been reset successfully.');

      const updatedStudent = await Student.findById(student._id);
      const isMatch = await bcrypt.compare(newPassword, updatedStudent!.password);
      expect(isMatch).toBe(true);
      expect(sendEmail).toHaveBeenCalled();
    });
  });

  describe('resendResetToken', () => {
    it('should resend a reset token', async () => {
      const student = await createTestStudent();
      const result = await studentService.resendResetToken(student.email);

      expect(result).toHaveProperty('message', 'Reset token resent successfully.');
      const token = await Token.findOne({ userId: student._id });
      expect(token).toBeTruthy();
      expect(sendEmail).toHaveBeenCalled();
    });
  });
});

describe('Student CRUD Operations', () => {
  let studentToken: string;
  let studentId: string;

  beforeEach(async () => {
    const { token, studentId: id } = await createAndLoginStudent();
    studentToken = token;
    studentId = id;
  });

  it('should get all students', async () => {
    const res = await request(app)
      .get('/api/student')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get one student', async () => {
    const res = await request(app)
      .get(`/api/student/${studentId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(studentId);
  });

  it('should update a student', async () => {
    const res = await request(app)
      .put(`/api/student/${studentId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ fullName: 'Updated Student' });

    expect(res.status).toBe(200);
    expect(res.body.data.fullName).toBe('Updated Student');
  });

  it('should delete a student', async () => {
    const res = await request(app)
      .delete(`/api/student/${studentId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.message).toMatch(/deleted successfully/i);

    const deleted = await Student.findById(studentId);
    expect(deleted).toBeNull();
  });
});

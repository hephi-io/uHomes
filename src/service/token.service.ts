import Token from '../models/token.model';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { BadRequestError, NotFoundError } from '../middlewares/error.middlewere';

interface SignedTokenPayload {
  code: string;
  email: string;
  iat?: number;
  exp?: number;
}

export class TokenService {
  /**
   * Generate a unique 6-digit verification code
   */
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create and save a verification code
   */
  async createVerificationCode(userId: string, email: string): Promise<string> {
    // Invalidate any existing pending codes for this user
    await Token.updateMany(
      { userId, typeOf: 'emailVerification', status: 'pending' },
      { status: 'expired' }
    );

    // Generate unique code (ensure it doesn't already exist for pending codes)
    let code: string;
    let codeExists = true;
    let attempts = 0;
    const maxAttempts = 10;

    while (codeExists && attempts < maxAttempts) {
      code = this.generateCode();
      const existing = await Token.findOne({
        token: code,
        typeOf: 'emailVerification',
        status: 'pending',
        expiresAt: { $gt: new Date() },
      });
      codeExists = !!existing;
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new BadRequestError('Failed to generate unique verification code');
    }

    // Set expiry to 12 minutes (between 10-15 minutes as specified)
    const expiresAt = new Date(Date.now() + 12 * 60 * 1000);

    await Token.create({
      userId,
      typeOf: 'emailVerification',
      token: code!,
      email: email.toLowerCase(),
      expiresAt,
      attempts: 0,
      status: 'pending',
    });

    return code!;
  }

  /**
   * Verify a code for a given email
   */
  async verifyCode(email: string, code: string): Promise<{ userId: string; tokenId: string }> {
    const token = await Token.findOne({
      email: email.toLowerCase(),
      token: code,
      typeOf: 'emailVerification',
      status: 'pending',
    });

    if (!token) {
      throw new BadRequestError('Invalid verification code');
    }

    // Check if code is expired
    if (new Date() > token.expiresAt) {
      token.status = 'expired';
      await token.save();
      throw new BadRequestError('Verification code has expired');
    }

    // Check if code has exceeded max attempts (5 attempts)
    if ((token.attempts || 0) >= 5) {
      token.status = 'expired';
      await token.save();
      throw new BadRequestError(
        'Maximum verification attempts exceeded. Please request a new code.'
      );
    }

    // Check if user is already verified
    const user = await User.findById(token.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestError('Account is already verified');
    }

    return {
      userId: token.userId.toString(),
      tokenId: String(token._id),
    };
  }

  /**
   * Mark a verification code as verified
   */
  async markAsVerified(tokenId: string): Promise<void> {
    await Token.findByIdAndUpdate(tokenId, {
      status: 'verified',
    });
  }

  /**
   * Increment attempts counter for a verification code
   */
  async incrementAttempts(tokenId: string): Promise<void> {
    await Token.findByIdAndUpdate(tokenId, {
      $inc: { attempts: 1 },
    });
  }

  /**
   * Sign a verification URL with JWT
   */
  signVerificationUrl(code: string, email: string): string {
    const payload: SignedTokenPayload = {
      code,
      email: email.toLowerCase(),
    };

    const secret = process.env.JWT_VERIFICATION_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET or JWT_VERIFICATION_SECRET must be set');
    }

    return jwt.sign(payload, secret, {
      expiresIn: '15m', // Match code expiry
    });
  }

  /**
   * Verify and extract code/email from signed URL token
   */
  verifySignedUrl(signedToken: string): { code: string; email: string } {
    const secret = process.env.JWT_VERIFICATION_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET or JWT_VERIFICATION_SECRET must be set');
    }

    try {
      const decoded = jwt.verify(signedToken, secret) as SignedTokenPayload;
      return {
        code: decoded.code,
        email: decoded.email,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestError('Verification link has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError('Invalid verification link');
      }
      throw new BadRequestError('Failed to verify link');
    }
  }

  /**
   * Check if user can resend verification code (rate limiting: max 3 per hour)
   */
  async checkRateLimit(email: string): Promise<boolean> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCodes = await Token.countDocuments({
      email: email.toLowerCase(),
      typeOf: 'emailVerification',
      createdAt: { $gte: oneHourAgo },
    });

    return recentCodes < 3;
  }

  /**
   * Get the count of recent verification codes for an email
   */
  async getRecentCodeCount(email: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return Token.countDocuments({
      email: email.toLowerCase(),
      typeOf: 'emailVerification',
      createdAt: { $gte: oneHourAgo },
    });
  }
}

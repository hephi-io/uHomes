import { sendEmail } from './sendEmail';

/**
 * Send verification email with 6-digit code and signed verification URL
 */
export const sendVerificationEmail = async (
  email: string,
  code: string,
  signedUrl: string,
  userName?: string
): Promise<void> => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationUrl = `${frontendUrl}/auth/verify?token=${signedUrl}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - UHomes</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="color: #3E78FF; margin-top: 0;">Welcome to U-Homes!</h2>
        <p>Hi ${userName || 'there'},</p>
        <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
      </div>

      <div style="background-color: #ffffff; border: 2px solid #3E78FF; border-radius: 10px; padding: 30px; text-align: center; margin-bottom: 20px;">
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">Your verification code is:</p>
        <h1 style="font-size: 48px; letter-spacing: 8px; color: #3E78FF; margin: 20px 0; font-weight: bold;">${code}</h1>
        <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">This code will expire in 12 minutes</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <p style="margin-bottom: 20px; color: #666;">Or click the button below to verify instantly:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; background-color: #3E78FF; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
          Verify Email Address
        </a>
      </div>

      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p style="margin: 0; font-size: 12px; color: #666;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #3E78FF; word-break: break-all;">${verificationUrl}</a>
        </p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; margin: 0;">
          If you didn't create an account with UHomes, please ignore this email.<br>
          This verification code will expire in 12 minutes for security reasons.
        </p>
        <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">
          Best regards,<br>
          <strong>The UHomes Team</strong>
        </p>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, 'Verify Your Email - UHomes', html);
};

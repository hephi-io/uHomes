export const sendEmailVerification = (fullName: string, _email: string, otp: string) => {
  return `
        <h3>Hello ${fullName}</h3>
        <p>Thank you for signing up. Please verify your email using this code:</p>
        <h2>${otp}</h2>
        <p>This code will expire in 5 minutes.</p>
    `;
};

export const sendResendVerificationEmail = (fullName: string, _email: string, otp: string) => {
  return `
    <h3>Hello ${fullName}</h3>
    <p>You requested a new verification code. Use the code below to verify your email:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 5 minutes.</p>
  `
}

export const sendForgotPasswordEmail = (fullName: string, _email: string, otp: string) => {
  return `
    <h3>Hello ${fullName}</h3>
    <p>You requested to reset your password. Use the code below to continue:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 5 minutes.</p>
  `
}

export const sendPasswordResetSuccessEmail = (fullName: string, _email: string) => {
  return `
    <h3>Hello ${fullName}</h3>
    <p>Your password has been updated successfully.</p>
    <p>If you did not perform this change, please contact our support team immediately.</p>
  `
}

export const sendAccountUpdatedEmail = (fullName: string, _email: string, password: string) => {
  return `
    <h3>Account Update Notification</h3>
    <p>Hi ${fullName},</p>
    <p>Your account details were recently updated.</p>
    ${password ? '<p>Your password has been changed.</p>' : ''}
    <p>If you did <b>NOT</b> make this change, please contact support immediately.</p>
    <br>
    <p>Best regards,<br>UHomes Team</p>
  `
}

export const sendResendResetOtpEmail = (fullName: string, _email: string,  otp: string) => {
  return `
    <h3>Password Reset OTP</h3>
     <h3>Hello ${fullName}</h3>
    <p>Your new OTP is:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 5 minutes.</p>
  `
}



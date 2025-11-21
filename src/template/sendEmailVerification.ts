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

export const sendAccountUpdatedEmail = (fullName: string, _email: string) => {
  return `
    <h3>Hello ${fullName}</h3>
    <p>Your account details have been updated successfully.</p>
    <p>If you did not make this change, please review your security settings.</p>
  `
}

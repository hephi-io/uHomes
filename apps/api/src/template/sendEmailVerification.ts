export const sendEmailVerification = (fullName: string, email: string, otp: string) => {
  return `
        <h3>Hello ${fullName}</h3>
        <p>Thank you for signing up. Please verify your email using this code:</p>
        <h2>${otp}</h2>
        <p>This code will expire in 5 minutes.</p>
    `;
};

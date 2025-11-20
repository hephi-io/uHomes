export interface SignupPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  types: 'Student' | 'Agent' | 'Admin';
  university?: string;
  yearOfStudy?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  token: string;
}

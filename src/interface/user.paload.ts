

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


export interface BookingPayload {
  propertyid: string
  tenant?: string   // required ONLY if an Agent creates the booking
  moveInDate: Date
  moveOutDate?: Date
  duration: string
  amount: number
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus?: 'pending' | 'paid' | 'refunded'
}

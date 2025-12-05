import axios from 'axios';
import 'dotenv/config';
import { nairaToKobo } from '../utils/amountConverstion';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

type TInitializeTransactionPayload = { email: string; amount: number };

export class PaystackService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    if (!this.secretKey) throw new Error('PAYSTACK_SECRET_KEY is not set in environment variables');
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async initializeTransaction(payload: TInitializeTransactionPayload) {
    if (!payload.amount) throw new Error('Amount is required');
    const { email, amount: plainAmount } = payload;
    const amount = nairaToKobo(plainAmount);

    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        { email, amount },
        { headers: this.getHeaders() }
      );
      return response.data.data; // contains reference & authorization_url
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to initialize transaction');
    }
  }

  async verifyTransaction(reference: string) {
    const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
    return response.data;
  }

  async refundTransaction(reference: string, amount: number) {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/refund`,
      { transaction: reference, amount },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async getTransaction(reference: string) {
    const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/${reference}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
    return response.data;
  }

  async listTransactions(perPage: number = 50, page: number = 1) {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction?perPage=${perPage}&page=${page}`,
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    );
    return response.data;
  }
}

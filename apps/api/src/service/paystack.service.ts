import axios from 'axios';
import crypto from 'crypto';
import 'dotenv/config';
import { nairaToKobo } from '../utils/amountConverstion';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

type TInitializeTransactionPayload = { email: string; amount: number; callback_url?: string };

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
    const { email, amount: plainAmount, callback_url } = payload;
    const amount = nairaToKobo(plainAmount);

    try {
      const requestBody: any = { email, amount };
      if (callback_url) {
        requestBody.callback_url = callback_url;
      }

      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        requestBody,
        { headers: this.getHeaders() }
      );
      return response.data.data; // contains reference & authorization_url
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to initialize transaction');
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${this.secretKey}` },
      });

      if (response.data.status === false) {
        throw new Error(response.data.message || 'Transaction verification failed');
      }

      return response.data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to verify transaction');
    }
  }

  async refundTransaction(reference: string, amount: number) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/refund`,
        { transaction: reference, amount },
        { headers: this.getHeaders() }
      );

      if (response.data.status === false) {
        throw new Error(response.data.message || 'Refund failed');
      }

      return response.data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to process refund');
    }
  }

  async getTransaction(reference: string) {
    try {
      const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/${reference}`, {
        headers: { Authorization: `Bearer ${this.secretKey}` },
      });

      if (response.data.status === false) {
        throw new Error(response.data.message || 'Failed to get transaction');
      }

      return response.data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to get transaction');
    }
  }

  async listTransactions(perPage: number = 50, page: number = 1) {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction?perPage=${perPage}&page=${page}`,
        { headers: { Authorization: `Bearer ${this.secretKey}` } }
      );

      if (response.data.status === false) {
        throw new Error(response.data.message || 'Failed to list transactions');
      }

      return response.data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to list transactions');
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const hash = crypto.createHmac('sha512', this.secretKey).update(payload).digest('hex');
    return hash === signature;
  }
}

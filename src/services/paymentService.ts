import { api } from './api';

export interface InitializePaymentResponse {
  reference: string;
  amount: number; // kobo
  email: string;
}

export interface VerifyPaymentResponse {
  message: string;
  user: {
    name: string;
    email: string;
    plan: 'free' | 'pro';
    planActivatedAt?: string;
  };
}

export interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  currency: string;
  note: string;
}

export interface PaymentRequestRecord {
  _id: string;
  receiptUrl: string;
  reference?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export const paymentService = {
  async initialize(): Promise<InitializePaymentResponse> {
    const { data } = await api.post('/plans/payment/initialize');
    return data;
  },
  async verify(reference: string): Promise<VerifyPaymentResponse> {
    const { data } = await api.post('/plans/payment/verify', { reference });
    return data;
  },
  async getBankDetails(): Promise<BankDetails> {
    const { data } = await api.get('/payments/bank-details');
    return data;
  },
  async submitRequest(payload: { receiptUrl: string; reference?: string; amount?: number }): Promise<PaymentRequestRecord> {
    const { data } = await api.post('/payments/request', payload);
    return data;
  },
  async myRequests(): Promise<PaymentRequestRecord[]> {
    const { data } = await api.get('/payments/my-requests');
    return data;
  },
};

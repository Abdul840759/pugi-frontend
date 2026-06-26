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

export const paymentService = {
  async initialize(): Promise<InitializePaymentResponse> {
    const { data } = await api.post('/plans/payment/initialize');
    return data;
  },
  async verify(reference: string): Promise<VerifyPaymentResponse> {
    const { data } = await api.post('/plans/payment/verify', { reference });
    return data;
  },
};

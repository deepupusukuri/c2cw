export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerification {
  success: boolean;
  providerRef: string;
}

export const PAYMENT_PROVIDER = "PAYMENT_PROVIDER";

export interface PaymentProvider {
  createOrder(amount: number, currency: string, notes?: Record<string, unknown>): Promise<PaymentOrder>;
  verifyPayment(payload: Record<string, unknown>): Promise<PaymentVerification>;
}

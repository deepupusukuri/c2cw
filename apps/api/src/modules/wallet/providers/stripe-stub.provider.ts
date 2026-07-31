import { Injectable } from "@nestjs/common";
import {
  PaymentOrder,
  PaymentProvider,
  PaymentVerification,
} from "./payment-provider.interface";

/**
 * Global-ready alternative to Razorpay. Implements the same PaymentProvider
 * interface but is NOT registered in WalletModule's providers — swap the
 * PAYMENT_PROVIDER binding to this class when global card payments are needed.
 */
@Injectable()
export class StripeStubProvider implements PaymentProvider {
  async createOrder(amount: number, currency = "USD"): Promise<PaymentOrder> {
    return { orderId: `stub_stripe_${Date.now()}`, amount, currency };
  }

  async verifyPayment(): Promise<PaymentVerification> {
    return { success: true, providerRef: `stub_stripe_ref_${Date.now()}` };
  }
}

import { Injectable, Logger } from "@nestjs/common";
import {
  PaymentOrder,
  PaymentProvider,
  PaymentVerification,
} from "./payment-provider.interface";

/**
 * Stub implementation — no real Razorpay API calls are made.
 * Swap the body of these two methods for the `razorpay` SDK once
 * RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are available, keeping the
 * PaymentProvider interface unchanged so callers never need to change.
 */
@Injectable()
export class RazorpayStubProvider implements PaymentProvider {
  private readonly logger = new Logger(RazorpayStubProvider.name);
  private readonly configured = Boolean(
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET,
  );

  async createOrder(
    amount: number,
    currency = "INR",
    notes?: Record<string, unknown>,
  ): Promise<PaymentOrder> {
    if (!this.configured) {
      this.logger.warn("RAZORPAY_KEY_ID/SECRET not set — returning a stub order.");
    }
    return {
      orderId: `stub_order_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
      amount,
      currency,
    };
  }

  async verifyPayment(_payload: Record<string, unknown>): Promise<PaymentVerification> {
    if (!this.configured) {
      this.logger.warn("RAZORPAY_KEY_ID/SECRET not set — auto-approving stub payment.");
      return { success: true, providerRef: `stub_ref_${Date.now()}` };
    }
    // Real signature verification (crypto HMAC SHA256) goes here once keys are configured.
    return { success: true, providerRef: `stub_ref_${Date.now()}` };
  }
}

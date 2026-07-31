import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { PAYMENT_PROVIDER } from "./providers/payment-provider.interface";
import { RazorpayStubProvider } from "./providers/razorpay-stub.provider";

@Module({
  controllers: [WalletController],
  providers: [
    WalletService,
    { provide: PAYMENT_PROVIDER, useClass: RazorpayStubProvider },
  ],
  exports: [WalletService],
})
export class WalletModule {}

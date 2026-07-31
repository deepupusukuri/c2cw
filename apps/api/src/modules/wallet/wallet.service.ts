import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { PAYMENT_PROVIDER, PaymentProvider } from "./providers/payment-provider.interface";

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private paymentProvider: PaymentProvider,
  ) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException("Wallet not found");
    return wallet;
  }

  listTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async initiateTopUp(userId: string, amount: number) {
    const order = await this.paymentProvider.createOrder(amount, "INR", { userId });
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.PAYMENT,
        amount,
        status: TransactionStatus.PENDING,
        razorpayRef: order.orderId,
        metadata: toJson({ order }),
      },
    });
    return { transaction, order };
  }

  async confirmTopUp(transactionId: string, payload: Record<string, unknown> = {}) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) throw new NotFoundException("Transaction not found");
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException("Transaction already processed");
    }

    const verification = await this.paymentProvider.verifyPayment(payload);
    if (!verification.success) {
      return this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.FAILED },
      });
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.SUCCESS, razorpayRef: verification.providerRef },
      }),
      this.prisma.wallet.update({
        where: { userId: transaction.userId },
        data: { balance: { increment: transaction.amount } },
      }),
    ]);
    return updated;
  }

  async requestWithdrawal(userId: string, amount: number) {
    const wallet = await this.getWallet(userId);
    if (Number(wallet.balance) < amount) {
      throw new BadRequestException("Insufficient wallet balance");
    }
    return this.prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.PAYOUT,
        amount,
        status: TransactionStatus.PENDING,
      },
    });
  }

  listPendingWithdrawals() {
    return this.prisma.transaction.findMany({
      where: { type: TransactionType.PAYOUT, status: TransactionStatus.PENDING },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  async approveWithdrawal(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) throw new NotFoundException("Transaction not found");
    const wallet = await this.getWallet(transaction.userId);
    if (Number(wallet.balance) < Number(transaction.amount)) {
      throw new BadRequestException("Insufficient wallet balance at approval time");
    }
    const [updated] = await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.SUCCESS },
      }),
      this.prisma.wallet.update({
        where: { userId: transaction.userId },
        data: { balance: { decrement: transaction.amount } },
      }),
    ]);
    return updated;
  }

  rejectWithdrawal(transactionId: string) {
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: TransactionStatus.FAILED },
    });
  }
}

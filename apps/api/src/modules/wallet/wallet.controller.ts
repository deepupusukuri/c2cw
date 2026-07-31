import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { WalletService } from "./wallet.service";
import { TopUpDto } from "./dto/topup.dto";
import { WithdrawDto } from "./dto/withdraw.dto";

@Controller("wallet")
@UseGuards(ModuleEnabledGuard)
@RequireModule("WALLET")
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get("me")
  getMine(@CurrentUser() user: AuthUser) {
    return this.walletService.getWallet(user.id);
  }

  @Get("me/transactions")
  myTransactions(@CurrentUser() user: AuthUser) {
    return this.walletService.listTransactions(user.id);
  }

  @Post("topup")
  topUp(@CurrentUser() user: AuthUser, @Body() dto: TopUpDto) {
    return this.walletService.initiateTopUp(user.id, dto.amount);
  }

  @Post("topup/:transactionId/confirm")
  confirmTopUp(@Param("transactionId") transactionId: string, @Body() payload: Record<string, unknown>) {
    return this.walletService.confirmTopUp(transactionId, payload);
  }

  @Post("withdraw")
  withdraw(@CurrentUser() user: AuthUser, @Body() dto: WithdrawDto) {
    return this.walletService.requestWithdrawal(user.id, dto.amount);
  }

  @Get("withdrawals")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  pendingWithdrawals() {
    return this.walletService.listPendingWithdrawals();
  }

  @Patch("withdrawals/:transactionId/approve")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  approveWithdrawal(@Param("transactionId") transactionId: string) {
    return this.walletService.approveWithdrawal(transactionId);
  }

  @Patch("withdrawals/:transactionId/reject")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  rejectWithdrawal(@Param("transactionId") transactionId: string) {
    return this.walletService.rejectWithdrawal(transactionId);
  }
}

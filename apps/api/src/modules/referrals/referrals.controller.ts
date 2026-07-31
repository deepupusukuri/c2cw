import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { ReferralsService } from "./referrals.service";
import { ClaimReferralDto } from "./dto/claim-referral.dto";

@Controller("referrals")
@UseGuards(ModuleEnabledGuard)
@RequireModule("REFERRALS")
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Post("claim")
  claim(@CurrentUser() user: AuthUser, @Body() dto: ClaimReferralDto) {
    return this.referralsService.claim(user.id, dto.referrerId);
  }

  @Get("me")
  myLedger(@CurrentUser() user: AuthUser) {
    return this.referralsService.myLedger(user.id);
  }
}

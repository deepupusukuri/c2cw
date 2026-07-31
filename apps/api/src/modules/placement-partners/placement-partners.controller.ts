import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { PlacementPartnersService } from "./placement-partners.service";
import { RegisterPlacementPartnerDto } from "./dto/register-placement-partner.dto";
import { CreateReferralDto } from "./dto/create-referral.dto";

@Controller("placement-partners")
@UseGuards(ModuleEnabledGuard)
@RequireModule("PLACEMENT_PARTNERS")
export class PlacementPartnersController {
  constructor(private placementPartnersService: PlacementPartnersService) {}

  @Post("register")
  @UseGuards(RolesGuard)
  @Roles(Role.PLACEMENT_PARTNER, Role.ADMIN)
  register(@CurrentUser() user: AuthUser, @Body() dto: RegisterPlacementPartnerDto) {
    return this.placementPartnersService.register(user.id, dto);
  }

  @Get("me")
  @UseGuards(RolesGuard)
  @Roles(Role.PLACEMENT_PARTNER, Role.ADMIN)
  findMine(@CurrentUser() user: AuthUser) {
    return this.placementPartnersService.findMine(user.id);
  }

  @Post("referrals")
  @UseGuards(RolesGuard)
  @Roles(Role.PLACEMENT_PARTNER)
  createReferral(@CurrentUser() user: AuthUser, @Body() dto: CreateReferralDto) {
    return this.placementPartnersService.createReferral(user.id, dto);
  }

  @Get("referrals/mine")
  @UseGuards(RolesGuard)
  @Roles(Role.PLACEMENT_PARTNER)
  myReferrals(@CurrentUser() user: AuthUser) {
    return this.placementPartnersService.myReferrals(user.id);
  }

  @Get("referrals")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  allReferrals(@Query("status") status?: string) {
    return this.placementPartnersService.allReferrals(status);
  }

  @Patch("referrals/:id/mark-hired")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  markHired(@Param("id") id: string) {
    return this.placementPartnersService.markHired(id);
  }

  @Patch("referrals/:id/approve-commission")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  approveCommission(@Param("id") id: string) {
    return this.placementPartnersService.approveCommission(id);
  }

  @Patch("referrals/:id/release-commission")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  releaseCommission(@Param("id") id: string) {
    return this.placementPartnersService.releaseCommission(id);
  }

  @Patch("referrals/:id/reject")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  reject(@Param("id") id: string) {
    return this.placementPartnersService.reject(id);
  }
}

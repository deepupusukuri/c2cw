import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { SponsorshipService } from "./sponsorship.service";
import { CreateSponsorshipDto } from "./dto/create-sponsorship.dto";
import { CreateSponsorshipRequestDto } from "./dto/create-sponsorship-request.dto";
import { MatchSponsorshipDto } from "./dto/match-sponsorship.dto";

@Controller("sponsorship")
@UseGuards(ModuleEnabledGuard)
@RequireModule("SPONSORSHIP")
export class SponsorshipController {
  constructor(private sponsorshipService: SponsorshipService) {}

  @Post("pledges")
  createPledge(@CurrentUser() user: AuthUser, @Body() dto: CreateSponsorshipDto) {
    return this.sponsorshipService.createPledge(user.id, dto);
  }

  @Get("pledges/mine")
  myPledges(@CurrentUser() user: AuthUser) {
    return this.sponsorshipService.myPledges(user.id);
  }

  @Get("pledges")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  listPledges(@Query("status") status?: string) {
    return this.sponsorshipService.listPledges(status);
  }

  @Patch("pledges/:id/approve")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  approvePledge(@Param("id") id: string) {
    return this.sponsorshipService.approvePledge(id);
  }

  @Patch("pledges/:id/reject")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  rejectPledge(@Param("id") id: string) {
    return this.sponsorshipService.rejectPledge(id);
  }

  @Patch("pledges/:id/match")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  match(@Param("id") id: string, @Body() dto: MatchSponsorshipDto) {
    return this.sponsorshipService.match(id, dto.requestId);
  }

  @Post("requests")
  createRequest(@CurrentUser() user: AuthUser, @Body() dto: CreateSponsorshipRequestDto) {
    return this.sponsorshipService.createRequest(user.id, dto);
  }

  @Get("requests/mine")
  myRequests(@CurrentUser() user: AuthUser) {
    return this.sponsorshipService.myRequests(user.id);
  }

  @Get("requests")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  listRequests(@Query("status") status?: string) {
    return this.sponsorshipService.listRequests(status);
  }

  @Patch("requests/:id/reject")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  rejectRequest(@Param("id") id: string) {
    return this.sponsorshipService.rejectRequest(id);
  }
}

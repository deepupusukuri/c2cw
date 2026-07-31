import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { HiringPartnersService } from "./hiring-partners.service";
import { RegisterHiringPartnerDto } from "./dto/register-hiring-partner.dto";
import { BulkRequestDto } from "./dto/bulk-request.dto";

@Controller("hiring-partners")
@UseGuards(ModuleEnabledGuard)
@RequireModule("HIRING_PARTNERS")
@UseGuards(RolesGuard)
@Roles(Role.HIRING_PARTNER, Role.CORPORATE, Role.ADMIN)
export class HiringPartnersController {
  constructor(private hiringPartnersService: HiringPartnersService) {}

  @Post("register")
  register(@CurrentUser() user: AuthUser, @Body() dto: RegisterHiringPartnerDto) {
    return this.hiringPartnersService.register(user.id, dto);
  }

  @Get("me")
  findMine(@CurrentUser() user: AuthUser) {
    return this.hiringPartnersService.findMine(user.id);
  }

  @Post("bulk-request")
  bulkRequest(@CurrentUser() user: AuthUser, @Body() dto: BulkRequestDto) {
    return this.hiringPartnersService.bulkRequest(user.id, dto);
  }

  @Get("pipeline")
  pipeline(@CurrentUser() user: AuthUser) {
    return this.hiringPartnersService.pipeline(user.id);
  }

  @Get("analytics")
  analytics(@CurrentUser() user: AuthUser) {
    return this.hiringPartnersService.analytics(user.id);
  }
}

import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { CampusAmbassadorService } from "./campus-ambassador.service";
import { ApplyCampusAmbassadorDto } from "./dto/apply-campus-ambassador.dto";

@Controller("campus-ambassador")
@UseGuards(ModuleEnabledGuard)
@RequireModule("CAMPUS_AMBASSADOR")
export class CampusAmbassadorController {
  constructor(private campusAmbassadorService: CampusAmbassadorService) {}

  @Post("apply")
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  apply(@CurrentUser() user: AuthUser, @Body() dto: ApplyCampusAmbassadorDto) {
    return this.campusAmbassadorService.apply(user.id, dto);
  }

  @Get("me")
  findMine(@CurrentUser() user: AuthUser) {
    return this.campusAmbassadorService.findMine(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  list(@Query("status") status?: string) {
    return this.campusAmbassadorService.list(status);
  }

  @Patch(":id/approve")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  approve(@Param("id") id: string) {
    return this.campusAmbassadorService.approve(id);
  }

  @Patch(":id/reject")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  reject(@Param("id") id: string) {
    return this.campusAmbassadorService.reject(id);
  }
}

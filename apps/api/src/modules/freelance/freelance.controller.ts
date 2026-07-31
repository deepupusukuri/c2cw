import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { FreelanceService } from "./freelance.service";
import { CreateFreelanceDto } from "./dto/create-freelance.dto";
import { AssignFreelanceDto } from "./dto/assign-freelance.dto";

@Controller("freelance")
@UseGuards(ModuleEnabledGuard)
@RequireModule("FREELANCE")
export class FreelanceController {
  constructor(private freelanceService: FreelanceService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.CORPORATE, Role.HIRING_PARTNER, Role.ADMIN)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateFreelanceDto) {
    return this.freelanceService.create(user.id, dto);
  }

  @Get()
  findAll(@Query("status") status?: string) {
    return this.freelanceService.findAll({ status });
  }

  @Public()
  @Get("public")
  findPublic() {
    return this.freelanceService.findPublic();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.freelanceService.findOne(id);
  }

  @Patch(":id/approve")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  approve(@Param("id") id: string) {
    return this.freelanceService.approve(id);
  }

  @Patch(":id/assign")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  assign(@Param("id") id: string, @Body() dto: AssignFreelanceDto) {
    return this.freelanceService.assign(id, dto.studentId);
  }

  @Patch(":id/milestones/:index/complete")
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT, Role.ADMIN)
  completeMilestone(@Param("id") id: string, @Param("index") index: string) {
    return this.freelanceService.completeMilestone(id, Number(index));
  }

  @Patch(":id/milestones/:index/release-payment")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  releasePayment(@Param("id") id: string, @Param("index") index: string) {
    return this.freelanceService.releaseMilestonePayment(id, Number(index));
  }
}

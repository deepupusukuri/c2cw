import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { RecommendationsService } from "./recommendations.service";

@Controller("recommendations")
@UseGuards(ModuleEnabledGuard)
@RequireModule("RECOMMENDATIONS")
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get("jobs")
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  jobsForMe(@CurrentUser() user: AuthUser, @Query("limit") limit?: string) {
    return this.recommendationsService.jobsForStudent(user.id, limit ? Number(limit) : undefined);
  }

  @Get("candidates/:jobId")
  @UseGuards(RolesGuard)
  @Roles(Role.HIRING_PARTNER, Role.CORPORATE, Role.ADMIN)
  candidatesForJob(@Param("jobId") jobId: string, @Query("limit") limit?: string) {
    return this.recommendationsService.candidatesForJob(jobId, limit ? Number(limit) : undefined);
  }
}

import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { StudentProfileService } from "./student-profile.service";
import { UpdateStudentProfileDto } from "./dto/update-profile.dto";
import { SetAiAnalysisDto } from "./dto/set-ai-analysis.dto";

@Controller("student-profile")
@UseGuards(ModuleEnabledGuard)
@RequireModule("STUDENT_PROFILE")
export class StudentProfileController {
  constructor(private profileService: StudentProfileService) {}

  @Get("me")
  getMine(@CurrentUser() user: AuthUser) {
    return this.profileService.findByUserId(user.id);
  }

  @Patch("me")
  updateMine(@CurrentUser() user: AuthUser, @Body() dto: UpdateStudentProfileDto) {
    return this.profileService.update(user.id, dto);
  }

  @Patch(":userId/ai-analysis")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  setAiAnalysis(@Param("userId") userId: string, @Body() dto: SetAiAnalysisDto) {
    return this.profileService.setAiAnalysis(userId, dto.analysis);
  }

  @Get("search")
  search(
    @Query("skill") skill?: string,
    @Query("minReadinessScore") minScore?: string,
    @Query("q") q?: string,
  ) {
    return this.profileService.search({
      skill,
      minReadinessScore: minScore ? Number(minScore) : undefined,
      q,
    });
  }

  @Get(":userId")
  getByUserId(@Param("userId") userId: string) {
    return this.profileService.findByUserId(userId);
  }
}

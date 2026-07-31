import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { SetPipelineStageDto } from "./dto/set-pipeline-stage.dto";

@Controller("jobs")
@UseGuards(ModuleEnabledGuard)
@RequireModule("JOB_MARKETPLACE")
export class JobsController {
  constructor(
    private jobsService: JobsService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  findAll(@Query("skill") skill?: string, @Query("minReadinessScore") minScore?: string) {
    return this.jobsService.findAll({
      skill,
      minReadinessScore: minScore ? Number(minScore) : undefined,
    });
  }

  @Get("me/applications")
  myApplications(@CurrentUser() user: AuthUser) {
    return this.jobsService.myApplications(user.id);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.HIRING_PARTNER, Role.CORPORATE, Role.ADMIN)
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateJobDto) {
    const hiringPartner = await this.prisma.hiringPartner.findUnique({ where: { userId: user.id } });
    return this.jobsService.create(user.id, dto, hiringPartner?.id);
  }

  @Post(":id/apply")
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  apply(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.jobsService.apply(id, user.id);
  }

  @Get(":id/pipeline")
  @UseGuards(RolesGuard)
  @Roles(Role.HIRING_PARTNER, Role.CORPORATE, Role.ADMIN)
  pipeline(@Param("id") id: string) {
    return this.jobsService.pipelineForJob(id);
  }

  @Patch("applications/:id/stage")
  @UseGuards(RolesGuard)
  @Roles(Role.HIRING_PARTNER, Role.CORPORATE, Role.ADMIN)
  setStage(@Param("id") id: string, @Body() dto: SetPipelineStageDto) {
    return this.jobsService.setStage(id, dto);
  }
}

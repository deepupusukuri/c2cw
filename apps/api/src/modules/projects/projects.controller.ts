import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ReviewProjectDto } from "./dto/review-project.dto";

@Controller("projects")
@UseGuards(ModuleEnabledGuard)
@RequireModule("PROJECTS")
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.id, dto);
  }

  @Get("mine")
  findMine(@CurrentUser() user: AuthUser) {
    return this.projectsService.findMine(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  findAll(@Query("type") type?: string, @Query("status") status?: string) {
    return this.projectsService.findAll({ type, status });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(":id/submit")
  submit(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.projectsService.submit(id, user.id);
  }

  @Patch(":id/review")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  review(@Param("id") id: string, @Body() dto: ReviewProjectDto) {
    return this.projectsService.review(id, dto);
  }
}

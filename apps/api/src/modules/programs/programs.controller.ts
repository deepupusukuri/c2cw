import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { ProgramsService } from "./programs.service";
import { CreateProgramDto } from "./dto/create-program.dto";
import { SetEnrollmentStatusDto } from "./dto/set-enrollment-status.dto";

@Controller("programs")
@UseGuards(ModuleEnabledGuard)
@RequireModule("PROGRAMS")
export class ProgramsController {
  constructor(private programsService: ProgramsService) {}

  @Public()
  @Get()
  findAll() {
    return this.programsService.findAll();
  }

  @Get("me/enrollments")
  myEnrollments(@CurrentUser() user: AuthUser) {
    return this.programsService.myEnrollments(user.id);
  }

  @Get(":id/enrollments")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.COLLEGE, Role.TRAINER)
  enrollmentsForProgram(@Param("id") id: string) {
    return this.programsService.enrollmentsForProgram(id);
  }

  @Public()
  @Get(":idOrSlug")
  findOne(@Param("idOrSlug") idOrSlug: string) {
    return this.programsService.findOne(idOrSlug);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.COLLEGE)
  create(@Body() dto: CreateProgramDto) {
    return this.programsService.create(dto);
  }

  @Post(":id/enroll")
  enroll(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.programsService.enroll(user.id, id);
  }

  @Patch("enrollments/:id/status")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.COLLEGE, Role.TRAINER)
  setEnrollmentStatus(@Param("id") id: string, @Body() dto: SetEnrollmentStatusDto) {
    return this.programsService.setEnrollmentStatus(id, dto.status);
  }
}

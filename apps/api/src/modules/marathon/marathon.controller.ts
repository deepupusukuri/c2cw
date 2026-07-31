import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { MarathonService } from "./marathon.service";
import { CreateMarathonEventDto } from "./dto/create-marathon-event.dto";
import { SubmitMarathonProjectDto } from "./dto/submit-marathon-project.dto";

@Controller("marathon")
@UseGuards(ModuleEnabledGuard)
@RequireModule("MARATHON")
export class MarathonController {
  constructor(private marathonService: MarathonService) {}

  @Public()
  @Get("events")
  findAll() {
    return this.marathonService.findAll();
  }

  @Get("admin/events")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  findAllForAdmin() {
    return this.marathonService.findAllForAdmin();
  }

  @Get("events/mine")
  myParticipation(@CurrentUser() user: AuthUser) {
    return this.marathonService.myParticipation(user.id);
  }

  @Public()
  @Get("events/:slug")
  findBySlug(@Param("slug") slug: string) {
    return this.marathonService.findBySlug(slug);
  }

  @Post("events")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateMarathonEventDto) {
    return this.marathonService.create(dto);
  }

  @Patch("events/:id/publish")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  publish(@Param("id") id: string) {
    return this.marathonService.publish(id);
  }

  @Patch("events/:id/close")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  close(@Param("id") id: string) {
    return this.marathonService.close(id);
  }

  @Post("events/:id/register")
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  register(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.marathonService.register(id, user.id);
  }

  @Post("events/:id/submit")
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  submitProject(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: SubmitMarathonProjectDto,
  ) {
    return this.marathonService.submitProject(id, user.id, dto.projectId);
  }

  @Get("events/:id/participants")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  participants(@Param("id") id: string) {
    return this.marathonService.participantsForEvent(id);
  }

  @Patch("participants/:id/score")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  markScored(@Param("id") id: string) {
    return this.marathonService.markScored(id);
  }
}

import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { TalksService } from "./talks.service";
import { ApplyTalkDto } from "./dto/apply-talk.dto";
import { PublishTalkDto } from "./dto/publish-talk.dto";

@Controller("talks")
@UseGuards(ModuleEnabledGuard)
@RequireModule("TALKS")
export class TalksController {
  constructor(private talksService: TalksService) {}

  @Public()
  @Get()
  findPublished() {
    return this.talksService.findPublished();
  }

  @Get("mine")
  mine(@CurrentUser() user: AuthUser) {
    return this.talksService.mine(user.id);
  }

  @Get("admin/all")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAllForAdmin() {
    return this.talksService.findAllForAdmin();
  }

  @Public()
  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.talksService.findBySlug(slug);
  }

  @Post()
  apply(@CurrentUser() user: AuthUser, @Body() dto: ApplyTalkDto) {
    return this.talksService.apply(user.id, dto);
  }

  @Patch(":id/approve")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  approve(@Param("id") id: string) {
    return this.talksService.approve(id);
  }

  @Patch(":id/reject")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  reject(@Param("id") id: string) {
    return this.talksService.reject(id);
  }

  @Patch(":id/publish")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  publish(@Param("id") id: string, @Body() dto: PublishTalkDto) {
    return this.talksService.publish(id, dto);
  }
}

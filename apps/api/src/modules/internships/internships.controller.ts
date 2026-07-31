import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { InternshipsService } from "./internships.service";
import { CreateInternshipDto } from "./dto/create-internship.dto";
import { EvaluateInternshipDto } from "./dto/evaluate.dto";

@Controller("internships")
@UseGuards(ModuleEnabledGuard)
@RequireModule("INTERNSHIPS")
export class InternshipsController {
  constructor(
    private internshipsService: InternshipsService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.internshipsService.findAll();
  }

  @Get("admin/all")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  findAllForAdmin() {
    return this.internshipsService.findAllForAdmin();
  }

  @Get("mine")
  @UseGuards(RolesGuard)
  @Roles(Role.HIRING_PARTNER, Role.CORPORATE, Role.ADMIN)
  findMine(@CurrentUser() user: AuthUser) {
    return this.internshipsService.findMineForUser(user.id);
  }

  @Get(":id/applications")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.CORPORATE, Role.HIRING_PARTNER, Role.TRAINER)
  applications(@Param("id") id: string) {
    return this.internshipsService.applicationsForInternship(id);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.internshipsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.HIRING_PARTNER, Role.CORPORATE, Role.ADMIN)
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateInternshipDto) {
    const hiringPartner = await this.prisma.hiringPartner.findUnique({ where: { userId: user.id } });
    return this.internshipsService.create(user.id, hiringPartner?.id, dto);
  }

  @Patch(":id/approve")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  approve(@Param("id") id: string) {
    return this.internshipsService.approve(id);
  }

  @Post(":id/apply")
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  apply(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.internshipsService.apply(id, user.id);
  }

  @Patch(":id/select/:studentId")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.HIRING_PARTNER, Role.CORPORATE)
  select(@Param("id") id: string, @Param("studentId") studentId: string) {
    return this.internshipsService.select(id, studentId);
  }

  @Patch(":id/mentor/:mentorId")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  assignMentor(@Param("id") id: string, @Param("mentorId") mentorId: string) {
    return this.internshipsService.assignMentor(id, mentorId);
  }

  @Patch(":id/evaluate/:studentId")
  @UseGuards(RolesGuard)
  @Roles(Role.TRAINER, Role.ADMIN)
  evaluate(
    @Param("id") id: string,
    @Param("studentId") studentId: string,
    @Body() dto: EvaluateInternshipDto,
  ) {
    return this.internshipsService.evaluate(id, studentId, dto);
  }
}

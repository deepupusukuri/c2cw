import { Controller, Get, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AdminService } from "./admin.service";

@Controller("admin")
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get("overview")
  overview() {
    return this.adminService.overview();
  }
}

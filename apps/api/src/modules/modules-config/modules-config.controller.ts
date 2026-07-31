import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Public } from "../../common/decorators/public.decorator";
import { ModulesConfigService } from "./modules-config.service";
import { ToggleModuleDto } from "./dto/toggle-module.dto";

@Controller("modules")
export class ModulesConfigController {
  constructor(private modulesService: ModulesConfigService) {}

  @Public()
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Patch(":name")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  toggle(@Param("name") name: string, @Body() dto: ToggleModuleDto) {
    return this.modulesService.setEnabled(name, dto.isEnabled);
  }
}

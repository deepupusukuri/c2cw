import { Module } from "@nestjs/common";
import { ModulesConfigController } from "./modules-config.controller";
import { ModulesConfigService } from "./modules-config.service";

@Module({
  controllers: [ModulesConfigController],
  providers: [ModulesConfigService],
  exports: [ModulesConfigService],
})
export class ModulesConfigModule {}

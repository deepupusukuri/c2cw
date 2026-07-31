import { Module } from "@nestjs/common";
import { HiringPartnersController } from "./hiring-partners.controller";
import { HiringPartnersService } from "./hiring-partners.service";

@Module({
  controllers: [HiringPartnersController],
  providers: [HiringPartnersService],
  exports: [HiringPartnersService],
})
export class HiringPartnersModule {}

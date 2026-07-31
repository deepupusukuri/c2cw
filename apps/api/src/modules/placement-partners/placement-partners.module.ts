import { Module } from "@nestjs/common";
import { PlacementPartnersController } from "./placement-partners.controller";
import { PlacementPartnersService } from "./placement-partners.service";

@Module({
  controllers: [PlacementPartnersController],
  providers: [PlacementPartnersService],
  exports: [PlacementPartnersService],
})
export class PlacementPartnersModule {}

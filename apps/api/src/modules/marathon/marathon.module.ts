import { Module } from "@nestjs/common";
import { MarathonController } from "./marathon.controller";
import { MarathonService } from "./marathon.service";

@Module({
  controllers: [MarathonController],
  providers: [MarathonService],
  exports: [MarathonService],
})
export class MarathonModule {}

import { Module } from "@nestjs/common";
import { TalksController } from "./talks.controller";
import { TalksService } from "./talks.service";

@Module({
  controllers: [TalksController],
  providers: [TalksService],
  exports: [TalksService],
})
export class TalksModule {}

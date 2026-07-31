import { Module } from "@nestjs/common";
import { SmartSearchController } from "./smart-search.controller";
import { SmartSearchService } from "./smart-search.service";

@Module({
  controllers: [SmartSearchController],
  providers: [SmartSearchService],
  exports: [SmartSearchService],
})
export class SmartSearchModule {}

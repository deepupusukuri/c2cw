import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { SmartSearchService } from "./smart-search.service";

@Controller("smart-search")
@UseGuards(ModuleEnabledGuard)
@RequireModule("SMART_SEARCH")
export class SmartSearchController {
  constructor(private smartSearchService: SmartSearchService) {}

  @Public()
  @Get()
  search(@Query("q") q = "", @Query("limit") limit?: string) {
    return this.smartSearchService.search(q, limit ? Number(limit) : undefined);
  }
}

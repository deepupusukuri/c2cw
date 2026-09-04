import { Controller, Get } from "@nestjs/common";
import { Public } from "./common/decorators/public.decorator";

// Root health-check route. With the global "api" prefix (see main.ts) this
// answers plain GET /api, which is what Render's healthCheckPath (see
// render.yaml) polls. Without a route here, that request 404s even though
// the app is otherwise healthy, and Render eventually times the deploy out
// waiting for a successful response that can never come.
@Controller()
export class AppController {
  @Public()
  @Get()
  health() {
    return { status: "ok" };
  }
}

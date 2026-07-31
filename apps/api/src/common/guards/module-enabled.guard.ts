import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service";
import { REQUIRE_MODULE_KEY } from "../decorators/require-module.decorator";

@Injectable()
export class ModuleEnabledGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const moduleName = this.reflector.getAllAndOverride<string>(REQUIRE_MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!moduleName) {
      return true;
    }
    const mod = await this.prisma.module.findUnique({ where: { name: moduleName } });
    if (mod && !mod.isEnabled) {
      throw new ServiceUnavailableException(`The ${moduleName} module is currently disabled`);
    }
    return true;
  }
}

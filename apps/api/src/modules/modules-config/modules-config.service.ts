import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";

@Injectable()
export class ModulesConfigService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.module.findMany({ orderBy: { name: "asc" } });
  }

  async isEnabled(name: string): Promise<boolean> {
    const mod = await this.prisma.module.findUnique({ where: { name } });
    return mod?.isEnabled ?? true;
  }

  async setEnabled(name: string, isEnabled: boolean) {
    const mod = await this.prisma.module.findUnique({ where: { name } });
    if (!mod) {
      throw new NotFoundException(`Module ${name} not found`);
    }
    return this.prisma.module.update({ where: { name }, data: { isEnabled } });
  }

  async updateConfig(name: string, configJson: Record<string, unknown>) {
    const mod = await this.prisma.module.findUnique({ where: { name } });
    if (!mod) {
      throw new NotFoundException(`Module ${name} not found`);
    }
    return this.prisma.module.update({ where: { name }, data: { configJson: toJson(configJson) } });
  }
}

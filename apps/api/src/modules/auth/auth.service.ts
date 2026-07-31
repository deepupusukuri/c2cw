import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { OAuthProvider, Role } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private async issueToken(user: { id: string; email: string; role: Role }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException("Email already registered");
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: dto.role,
        oauthProvider: OAuthProvider.EMAIL,
      },
    });

    if (user.role === Role.STUDENT) {
      await this.prisma.studentProfile.create({ data: { userId: user.id } });
    }
    await this.prisma.wallet.create({ data: { userId: user.id } });

    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.issueToken(user);
  }

  async validateOAuthLogin(params: {
    email: string;
    name?: string;
    provider: OAuthProvider;
    oauthId: string;
    role?: Role;
  }) {
    let user = await this.prisma.user.findUnique({ where: { email: params.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: params.email,
          name: params.name,
          role: params.role ?? Role.STUDENT,
          oauthProvider: params.provider,
          oauthId: params.oauthId,
        },
      });
      if (user.role === Role.STUDENT) {
        await this.prisma.studentProfile.create({ data: { userId: user.id } });
      }
      await this.prisma.wallet.create({ data: { userId: user.id } });
    }
    return this.issueToken(user);
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }
}

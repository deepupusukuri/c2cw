import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AuthUser, OAuthProvider } from "@c2cw/types";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.id);
  }

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {
    // Redirect handled by passport-google-oauth20
  }

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken } = await this.authService.validateOAuthLogin({
      email: req.user.email,
      name: req.user.name,
      provider: OAuthProvider.GOOGLE as any,
      oauthId: req.user.oauthId,
    });
    res.redirect(`${process.env.WEB_APP_URL}/auth/callback?token=${accessToken}`);
  }

  @Public()
  @Get("linkedin")
  @UseGuards(AuthGuard("linkedin"))
  linkedinAuth() {
    // Redirect handled by the LinkedIn OIDC strategy
  }

  @Public()
  @Get("linkedin/callback")
  @UseGuards(AuthGuard("linkedin"))
  async linkedinCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken } = await this.authService.validateOAuthLogin({
      email: req.user.email,
      name: req.user.name,
      provider: OAuthProvider.LINKEDIN as any,
      oauthId: req.user.oauthId,
    });
    res.redirect(`${process.env.WEB_APP_URL}/auth/callback?token=${accessToken}`);
  }
}

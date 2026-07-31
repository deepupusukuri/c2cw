import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-oauth2";

// LinkedIn "Sign In with LinkedIn using OpenID Connect" — replaces the deprecated
// passport-linkedin-oauth2 package, which targets LinkedIn's retired v1 API.
@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, "linkedin") {
  constructor() {
    super({
      authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
      tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
      clientID: process.env.LINKEDIN_CLIENT_ID || "unconfigured",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "unconfigured",
      callbackURL:
        process.env.LINKEDIN_CALLBACK_URL || "http://localhost:4000/api/auth/linkedin/callback",
      scope: ["openid", "profile", "email"],
    });
  }

  async userProfile(accessToken: string, done: (err: any, profile?: any) => void) {
    try {
      const res = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await res.json();
      done(null, profile);
    } catch (err) {
      done(err);
    }
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    done(null, {
      email: profile.email,
      name: profile.name,
      oauthId: profile.sub,
    });
  }
}

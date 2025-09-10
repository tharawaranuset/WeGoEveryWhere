// src/auth/strategies/github.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

export interface GitHubProfile {
  id: string;
  username: string;
  displayName: string;
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
  //profileUrl: string;
}

@Injectable()
export class GitHubAuthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: process.env.GITHUB_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL! || "http://localhost:3001/auth/callback",
      scope: ["read:user", "user:email"],
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: GitHubProfile,
  ) {
    const primaryEmail = profile.emails?.[0];
    return {
      id: profile.id,
      subject: profile.id,
      email: primaryEmail?.value ?? null,
      emailVerified: !!primaryEmail?.verified,
      firstName: profile.displayName?.split(' ')[0] ?? null,
      lastName: profile.displayName?.split(' ').slice(1).join(' ') || null,
    };
  }
}
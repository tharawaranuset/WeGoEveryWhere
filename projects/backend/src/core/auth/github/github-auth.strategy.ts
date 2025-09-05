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
  profileUrl: string;
}

@Injectable()
export class GitHubAuthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.github.clientId', ''),
      clientSecret: configService.get<string>('auth.github.clientSecret', ''),
      callbackURL: configService.get<string>('auth.github.callbackURL', ''),
      scope: ['public_profile'], // Not confirm yet
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: GitHubProfile,
  ) {
    return profile; // Not confirm yet
  }
}
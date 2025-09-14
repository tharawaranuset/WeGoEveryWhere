// src/core/auth/auth.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from '@backend/src/configurations/configs/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {}

  // Access token
  signJwt(userId: number | string, email?: string) {
    const payload = { sub: userId, email, jti: crypto.randomUUID() };
    return this.jwtService.sign(payload);
  }

  // Refresh token — return token string + tokenId for DB
  signRefreshJwt(userId: number | string) {
    const tokenId = crypto.randomUUID();
    const payload = { sub: userId, tokenId };
    const refreshToken = this.jwtService.sign(payload, this.refreshJwtConfiguration);
    return { refreshToken, tokenId };
  }

  // (optional helpers you can call from the controller)
  verifyRefresh(refreshToken: string) {
    return this.jwtService.verify(refreshToken, this.refreshJwtConfiguration) as { sub: any; tokenId: string; iat: number; exp: number };
  }
}

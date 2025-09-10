// jwt.strategy.ts
import { Inject, Injectable } from '@nestjs/common';
import { ConfigFactoryKeyHost, ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { ConfigType } from '@nestjs/config';
import refreshJwtConfig from '@backend/src/configurations/configs/refresh-jwt.config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshJwtConfig.KEY) private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    configService: ConfigService
  ) {
    super({
        jwtFromRequest: ExtractJwt.fromExtractors([
            (request: Request) => request?.cookies?.refresh_jwt,
        ]),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('auth.jwt.secret', ''),
    });
  }

  validate(payload: any) {
    return payload;
  }
}

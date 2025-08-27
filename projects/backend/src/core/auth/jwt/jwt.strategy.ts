// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService
  ) {
    super({
        jwtFromRequest: ExtractJwt.fromExtractors([
            // Users can send us the JWT token either by a bearer token in an authorization header...
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ... or in a cookie named "jwt"
            (request: Request) => request?.cookies?.jwt,
        ]),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('auth.jwt.secret', ''),
    });
  }

  validate(payload: any) {
    return { payload: payload };
  }
}

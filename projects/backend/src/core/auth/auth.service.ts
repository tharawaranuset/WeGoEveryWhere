import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from '@backend/src/configurations/configs/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY) private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    ) {}

    signJwt(id: any) {
        const payload = { sub: id };
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
    }

    signRefreshJwt(id: any) {
        const payload = { sub: id };
        const refreshToken = this.jwtService.sign(payload, this.refreshJwtConfiguration);
        return refreshToken;
    }
}

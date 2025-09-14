import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from '@backend/src/configurations/configs/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

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
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}

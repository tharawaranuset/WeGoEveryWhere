import { Injectable, Res } from '@nestjs/common';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    signJwt(reqUser: any) {
        const payload = { sub: reqUser.id };
        const access_token = this.jwtService.sign(payload);
        return access_token;
    }
}

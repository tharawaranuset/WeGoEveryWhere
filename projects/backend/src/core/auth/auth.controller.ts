import { Body, Controller, Get, Post, Req, Res, UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiBody } from '@nestjs/swagger';

import { Public } from '@backend/src/shared/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/access-jwt/jwt.guard';
import { RefreshJwtGuard } from './jwt/refresh-jwt/refresh-jwt.guard';
import { GitHubAuthGuard } from './github/github-auth.guard';

import { UsersRepository } from '@backend/src/modules/users.repository';
import { RegisterDto } from '@backend/src/modules/dto/register.dto';
import { RefreshTokensRepository } from '@backend/src/modules/refreshTokens.repository';

import { hash as argon2Hash, verify as argon2Verify } from '@node-rs/argon2';

import { GitHubAuthGuard } from './github/github-auth.guard';
import { UsersRepository } from '@backend/src/modules/users.repository';
import { RegisterDto } from '@backend/src/modules/dto/register.dto';
import { RefreshTokensRepository } from '@backend/src/modules/refreshTokens.repository';
import { hash as argon2Hash, verify as argon2Verify } from '@node-rs/argon2';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepo: RefreshTokensRepository,
  ) {}

  // ----------------------------------------------------------------
  // Passwordless/dev bearer route (kept as in develop)
  // Stores refresh token row and sets cookies.
  // username MUST be a numeric userId for the FK (or adapt to lookup).
  // ----------------------------------------------------------------
  @Public()
  @Post('bearer')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { username: { type: 'string' } },
    },
  })
  async apiBearerAuth(
    @Body('username') username: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const userId = Number(username);
    if (!Number.isFinite(userId)) {
      throw new BadRequestException('username must be a numeric user id for this route');
    }

    const accessToken = this.authService.signJwt(userId);
    const { refreshToken } = this.authService.signRefreshJwt(userId);

    console.log('Inserting refresh token for user:', userId);
    // store hashed refresh token in DB
    await this.refreshTokensRepo.create(
      userId,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      req.ip,
      (req.headers['user-agent'] as string) ?? undefined,
    );
    console.log('Inserted refresh token for user:', userId);

    // set cookies
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_jwt', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { accessToken };
  }

  // ----------------------------------------------------------------
  // GitHub OAuth callback
  // Fix: set refresh cookie to the REFRESH token (not access).
  // Also store refresh token row in DB.
  // ----------------------------------------------------------------
  @Public()
  @UseGuards(GitHubAuthGuard)
  @Get('callback')
  async githubCallback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.signJwt(req.user.id, req.user.email);
    const { refreshToken } = this.authService.signRefreshJwt(req.user.id);

    // store hashed refresh token in DB
    await this.refreshTokensRepo.create(
      Number(req.user.id),
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      req.ip,
      (req.headers['user-agent'] as string) ?? undefined,
    );

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_jwt', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return 'Github Callback Successful';
  }

  // ----------------------------------------------------------------
  // Refresh: verify refresh JWT -> find matching row by user -> verify hash
  // -> revoke that row -> create & store new refresh -> set cookies -> new access.
  // ----------------------------------------------------------------
  @Public()
  @UseGuards(RefreshJwtGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefresh =
      (req.cookies?.['refresh_jwt'] as string) ||
      (req.body as any)?.refreshToken ||
      (req.headers['x-refresh-token'] as string);

    if (!rawRefresh) throw new UnauthorizedException('Missing refresh token');

    // decode & cryptographically verify with REFRESH_JWT_SECRET
    const { sub: userId } = this.authService.verifyRefresh(rawRefresh);

    // fetch all non-revoked tokens for this user and find the matching one
    const rows = await this.refreshTokensRepo.findValidByUser(Number(userId));
    let matchedId: number | null = null;

    for (const row of rows) {
      if (row.revoked || row.expiresAt < new Date()) continue;
      const same = row.tokenHash ? await argon2Verify(row.tokenHash, rawRefresh) : false;
      if (same) {
        matchedId = row.id;
        break;
      }
    }

    if (matchedId == null) {
      throw new UnauthorizedException('Refresh token invalid or revoked');
    }

    // revoke old row
    await this.refreshTokensRepo.revokeById(matchedId);

    // rotate: mint and store new refresh
    const { refreshToken: newRefresh } = this.authService.signRefreshJwt(userId);
    await this.refreshTokensRepo.create(
      Number(userId),
      newRefresh,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      req.ip,
      (req.headers['user-agent'] as string) ?? undefined,
    );

    // set new refresh cookie
    res.cookie('refresh_jwt', newRefresh, {
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // issue new access token
    const accessToken = this.authService.signJwt(userId);
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    return { accessToken };
  }

  // ----------------------------------------------------------------
  // Register (unchanged except: consider also issuing refresh+store if you want)
  // ----------------------------------------------------------------
  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersRepository.createUser(body);

    const accessToken = this.authService.signJwt(user.uid);
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    return { user, accessToken };
  }


  // ----------------------------------------------------------------
  // Logout: verify refresh token -> revoke it -> clear cookies.
  // (Access token remains short-lived; that’s fine.)
  // ----------------------------------------------------------------
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefresh =
      (req.cookies?.['refresh_jwt'] as string) ||
      (req.body as any)?.refreshToken ||
      (req.headers['x-refresh-token'] as string);

    if (rawRefresh) {
      try {
        const { sub: userId } = this.authService.verifyRefresh(rawRefresh);

        // find the matching row for this user and revoke it
        const rows = await this.refreshTokensRepo.findValidByUser(Number(userId));
        for (const row of rows) {
          if (row.revoked || row.expiresAt < new Date()) continue;
          const same = row.tokenHash ? await argon2Verify(row.tokenHash, rawRefresh) : false;
          if (same) {
            await this.refreshTokensRepo.revokeById(row.id);
            break;
          }
        }
      } catch {
        // ignore invalid refresh; still clear cookies
      }
    }

    res.clearCookie('jwt', { path: '/' });
    res.clearCookie('refresh_jwt', { path: '/' });
    return { message: 'Logged out' };
  }

  // ----------------------------------------------------------------
  // Logout everywhere: revoke all refresh tokens for current user
  // ----------------------------------------------------------------
  @UseGuards(JwtGuard)
  @Post('logout-all')
  async logoutAll(@Req() req: any) {
    await this.refreshTokensRepo.revokeAllByUser(Number(req.user.sub));
    return { message: 'Logged out on all devices' };
  }
}
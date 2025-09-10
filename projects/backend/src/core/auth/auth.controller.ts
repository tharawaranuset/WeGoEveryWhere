import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GitHubAuthGuard } from './github/github-auth.guard';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/access-jwt/jwt.guard';
import { Public } from '@backend/src/shared/decorators/public.decorator';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RefreshJwtGuard } from './jwt/refresh-jwt/refresh-jwt.guard';
import { ConsoleLogWriter } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '@backend/src/modules/users.repository';
import { RegisterDto } from '@backend/src/modules/dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  // this Route sus
  @Public()
  @Post('bearer')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'integer' },
      },
    },
  })
  apiBearerAuth(@Body('userId') userId: number) {
    const accessToken = this.authService.signJwt(userId);
    return { accessToken: accessToken };
  }

  @Public()
  @UseGuards(GitHubAuthGuard)
  @Get('github')
  async githubAuth() {
    // Redirect to Github
  }

  @Public()
  @UseGuards(GitHubAuthGuard)
  @Get('callback')
  async githubCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    
    const appUser = await this.authService.upsertOAuthUser({
      provider: 'github',
      subject: req.user.subject ?? req.user.id,
      email: req.user.email ?? null,
      firstName: req.user.firstName ?? null,
      lastName: req.user.lastName ?? null,
    });
    
    const userId = appUser.userId;
    
    const accessToken = this.authService.signJwt(userId);
    const refreshToken = this.authService.signRefreshJwt(userId);
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
    return {user: appUser, accessToken};
  }

  @Public()
  @UseGuards(RefreshJwtGuard)
  @Get('refresh-token')
  refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    // TODO: revoke refresh token
    const accessToken = this.authService.signJwt(req.user.sub);
    res.cookie('jwt', accessToken, { 
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });
    return 'Access token refreshed';
  }

  @Public()
  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    // 1) create user row
    const user = await this.usersRepository.createUser(body);

    const accessToken = this.authService.signJwt(user.userId);

    // simple cookie (keep in sync with your config)
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    // return the newly created user (no secrets)
    return { user, accessToken };
  }


}

import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GitHubAuthGuard } from './github/github-auth.guard';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/access-jwt/jwt.guard';
import { Public } from '@backend/src/shared/decorators/public.decorator';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RefreshJwtGuard } from './jwt/refresh-jwt/refresh-jwt.guard';
import { ConsoleLogWriter } from 'drizzle-orm';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // this Route sus
  @Public()
  @ApiBearerAuth('swagger-login')
  @Post('bearer')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      },
    },
  })
  apiBearerAuth(@Body('username') username: string) {
    const accessToken = this.authService.signJwt(username);
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
  githubCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.signJwt(req.user.id);
    const refreshToken = this.authService.signRefreshJwt(req.user.id);
    res.cookie('jwt', accessToken, { httpOnly: true });
    res.cookie('refresh_jwt', refreshToken, { httpOnly: true });
    return 'Github Callback Successful';
  }

  @Public()
  @UseGuards(RefreshJwtGuard)
  @Get('refresh-token')
  refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.signJwt(req.user.sub);
    res.cookie('jwt', accessToken, { httpOnly: true });
    return 'Access token refreshed';
  }
}

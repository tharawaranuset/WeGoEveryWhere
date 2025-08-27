import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GitHubAuthGuard } from './github/github-auth.guard';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/jwt.guard';
import { Public } from '@backend/src/shared/decorators/public.decorator';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiBearerAuth('swagger-login')
  @Get('bearer')
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


  @Get('github')
  @Public()
  @UseGuards(GitHubAuthGuard)
  async githubAuth() {
    // Redirect to Github
  }

  @Get('callback')
  @UseGuards(GitHubAuthGuard)
  githubCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    // Idea is using Id and AuthProvider with user Table
    const accessToken = this.authService.signJwt(req.user);
    res.cookie('jwt', accessToken);
    return 'hello';
  }
}

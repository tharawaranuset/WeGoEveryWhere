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
import { AuthUsersRepository } from '@backend/src/modules/auth-users.repository';
import { RegisterDto } from '@backend/src/modules/dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly authUsersRepository: AuthUsersRepository,
  ) {}

  // this Route sus
  @Public()
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
    res.cookie('jwt', accessToken, { 
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });
    res.cookie('refresh_jwt', accessToken, { 
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return 'Github Callback Successful';
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
    try {
      // 1) Check if email already exists
      const existingUser = await this.authUsersRepository.findByEmail(body.email);
      if (existingUser) {
        return {
          success: false,
          error: 'Email already registered'
        };
      }

      // 2) Hash the password
      const passwordHash = await this.authService.hashPassword(body.password);

      // 3) Create user in users table
      const user = await this.usersRepository.createUser(body);

      // 4) Create auth record in auth_users table
      await this.authUsersRepository.createAuthUser(user.userId, body.email, passwordHash);

      // 5) Generate JWT token
      const accessToken = this.authService.signJwt(user.userId.toString());

      // 6) Set cookie
      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15,
      });

      // 7) Return success response
      return { 
        success: true,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: body.email,
        },
        accessToken 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed',
        details: error.message
      };
    }
  }

  //clear user cookie
  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
    });
    res.clearCookie('refresh_jwt', {
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.jwt.cookies_secure'),
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }
}
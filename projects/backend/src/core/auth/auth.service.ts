import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from '@backend/src/configurations/configs/refresh-jwt.config';
import { ConfigService } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
// import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { EmailService } from '@backend/src/shared/services/email.service';
import * as argon2 from 'argon2';
import { authUsers } from '@backend/src/database/schema/authUsers.schema';
import { db } from '@backend/src/database/connection';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    // private readonly sessionService: SessionService,
    // @Inject(DATABASE_CONNECTION)
    // private readonly db: DrizzleDb,
  ) {}

  signJwt(id: any) {
    const payload = { sub: id };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  signRefreshJwt(id: any) {
    const payload = { sub: id };
    const refreshToken = this.jwtService.sign(
      payload,
      this.refreshJwtConfiguration,
    );
    return refreshToken;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { v4: uuidv4 } = await import('uuid');

    const [authUser] = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, dto.email))
      .limit(1);

    if (!authUser) {
      return {
        message:
          'If an account with that email exists, a reset link has been sent',
      };
    }

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hr

    await db
      .update(authUsers)
      .set({
        resetToken,
        resetTokenExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(authUsers.id, authUser.id));

    const baseUrl = (
      this.configService.get('FRONTEND_URL') ?? 'http://localhost:3000'
    ).replace(/\/$/, '');
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    try {
      await this.emailService.sendPasswordResetEmail({
        name: 'User',
        email: authUser.email,
        resetUrl,
        expiresIn: '1 hour',
      });
    } catch (err) {
      console.error('Failed to send password reset email:', err);
    }

    return {
      message:
        'If an account with that email exists, a reset link has been sent',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const [authUser] = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.resetToken, dto.token))
      .limit(1);

    if (!authUser || !authUser.resetTokenExpiresAt) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const now = new Date();
    const exp = new Date(authUser.resetTokenExpiresAt);
    if (now > exp) {
      throw new BadRequestException('Reset token has expired');
    }

    const passwordHash = await argon2.hash(dto.password);

    await db
      .update(authUsers)
      .set({
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(authUsers.id, authUser.id));

    return { message: 'Password reset successfully' };
  }
}

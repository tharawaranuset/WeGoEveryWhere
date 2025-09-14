import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
// import { GitHubAuthStrategy } from './github/github-auth.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import jwtConfig from '@backend/src/configurations/configs/jwt.config';
import { JwtStrategy } from './jwt/access-jwt/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import refreshJwtConfig from '@backend/src/configurations/configs/refresh-jwt.config';
import { RefreshJwtStrategy } from './jwt/refresh-jwt/refresh-jwt.strategy';
import { UsersModule } from '@backend/src/modules/users.module';
import { EmailService } from '@backend/src/shared/services/email.service';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forFeature(refreshJwtConfig),
    PassportModule.register({ session: false }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UsersModule,
  ],

  controllers: [AuthController],
  providers: [
    // GitHubAuthStrategy,
    AuthService,
    JwtStrategy,
    RefreshJwtStrategy,
    EmailService,
  ],
})
export class AuthModule {}

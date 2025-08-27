import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GitHubAuthStrategy } from './github/github-auth.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import jwtConfig from '@backend/src/configurations/configs/jwt.config';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [GitHubAuthStrategy, AuthService, JwtStrategy],
})
export class AuthModule {}

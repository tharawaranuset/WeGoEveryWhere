import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GitHubAuthStrategy } from './github/github-auth.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule.register({ session: false })],
  controllers: [AuthController],
  providers: [GitHubAuthStrategy],
})
export class AuthModule {}

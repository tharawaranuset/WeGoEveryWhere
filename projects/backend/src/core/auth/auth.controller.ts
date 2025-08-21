import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GitHubAuthGuard } from './github/github-auth.guard';

@Controller('auth')
export class AuthController {
  @Get('github')
  @UseGuards(GitHubAuthGuard)
  async githubAuth() {
    // Redirect to Github
  }

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  githubCallback(@Req() req) {
    // Idea is using Id and AuthProvider with user Table
    return 'hello';
  }
}

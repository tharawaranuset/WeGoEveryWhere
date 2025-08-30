import { GitHubAuthGuard } from './github-auth.guard';

describe('GitHubAuthGuard', () => {
  it('should be defined', () => {
    expect(new GitHubAuthGuard()).toBeDefined();
  });
});

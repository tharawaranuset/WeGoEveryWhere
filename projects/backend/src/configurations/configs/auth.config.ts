import { AuthConfig } from '../interfaces/auth-config';

export default (): AuthConfig => ({
    auth: {
        jwt: {
			secret: process.env.JWT_SECRET ?? '',
			expiresInSeconds: parseInt(process.env.JWT_EXPIRATION_TIME_SECONDS ?? '0') || 900,
		},
		github: {
			clientId: process.env.GITHUB_OAUTH_CLIENT_ID ?? '',
			clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET ?? '',
			callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL ?? '',
		},
	},
});

export default () => ({
    auth: {
        jwt: {
			secret: process.env.JWT_SECRET,
			expiresIn: process.env.JWT_EXPIRATION_TIME ?? '15m',
			cookies_secure: process.env.NODE_ENV === 'production', 
		},
		refresh_jwt: {
			secret: process.env.REFRESH_JWT_SECRET,
			expiresIn: process.env.REFRESH_JWT_EXPIRATION_TIME ?? '7d',
		},
		github: {
			clientId: process.env.GITHUB_OAUTH_CLIENT_ID ?? '',
			clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET ?? '',
			callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL ?? '',
		},
	},
});
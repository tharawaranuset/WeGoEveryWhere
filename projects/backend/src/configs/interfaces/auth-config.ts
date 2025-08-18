export interface AuthConfig {
	auth: {
		jwt: {
			secret: string;
			expiresInSeconds: number;
		};
		github: {
			clientId: string;
			clientSecret: string;
			callbackURL: string;
		};
	};
	'auth.jwt.secret'?: string;
	'auth.jwt.expiresInSeconds'?: number;
	'auth.github.clientId'?: string;
	'auth.github.clientSecret'?: string;
	'auth.github.callbackURL'?: string;
}

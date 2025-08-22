export interface PostgresConfig {
    postgres: {
        db: string;
        port: number;
        user: string;
        password: string;
    };

    'postgres.db'?: string;
    'postgres.port'?: number;
    'postgres.user'?: string;
    'postgres.password'?: string;
}
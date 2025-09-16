import { PoolConfig } from 'pg';
import { config } from 'dotenv';
import { ENV_PATHS } from "@consts/env_paths";

config({ path: ENV_PATHS.ROOT });

export const poolConfig: PoolConfig = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT!) || 5432,
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'root',
    database: process.env.POSTGRES_DB || 'db',
    // Security settings
    //   ssl: process.env.NODE_ENV === 'production' ? {
    //     rejectUnauthorized: false,
    //   } : false,
    
    // Connection pool settings
    //   min: process.env.NODE_ENV === 'production' ? 2 : 1,
    //   max: process.env.NODE_ENV === 'production' ? 20 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
};
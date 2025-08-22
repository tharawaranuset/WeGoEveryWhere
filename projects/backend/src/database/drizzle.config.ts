import { defineConfig } from 'drizzle-kit';
import { ENV_PATHS } from "@consts/env_paths";
import { config } from 'dotenv';

config({ path: ENV_PATHS.ROOT });

export default defineConfig({
  schema: './schema/*',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT!) || 5432,
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'root',
    database: process.env.POSTGRES_DB || 'db',
    ssl: false
  },
  verbose: true,
  strict: true,
});
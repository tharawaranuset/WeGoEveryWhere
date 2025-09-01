// backend/src/db/drizzle.provider.ts
import { FactoryProvider } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

export const DrizzleProvider: FactoryProvider<NodePgDatabase<typeof schema>> = {
  provide: DRIZZLE_PROVIDER,
  useFactory: async () => {
    // Make sure your .env file is loaded by NestJS ConfigModule
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false, // Important for local development
    });
    return drizzle(pool, { schema });
  },
  inject: [],
};

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'root',
  database: process.env.POSTGRES_DB || 'WEGO_EVERYWHERE_DB',
  ssl: false,
});

const drizzleDb = drizzle(client, { schema });

export class DrizzleService {
  public db;
  constructor() {
    this.db = drizzleDb;
  }
}
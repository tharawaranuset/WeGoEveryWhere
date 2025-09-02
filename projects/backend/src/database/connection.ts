import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { privacyPolicies } from './schemas/privacy-policy.schema';
import { users } from './schemas/user.schema'; // your existing user schema

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
export const db = drizzle(client, {
  schema: { privacyPolicies, users },
});

export type Database = typeof db;
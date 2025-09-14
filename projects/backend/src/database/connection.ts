import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { poolConfig } from '../configurations/configs';
import { privacyPolicies } from './schema/privacy-policy.schema';
import { users } from './schema/users.schema'; 

const pool = new Pool(poolConfig);

// Export drizzle instance with schema
export const db = drizzle(pool, {
  schema: {
    privacyPolicies,
    users,
  },
});

// Error handling
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});
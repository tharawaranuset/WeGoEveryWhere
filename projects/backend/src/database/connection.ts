import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { poolConfig } from '../configurations/configs';

const pool = new Pool(poolConfig);

// Export drizzle instance
export const db = drizzle(pool);

// Error handling
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

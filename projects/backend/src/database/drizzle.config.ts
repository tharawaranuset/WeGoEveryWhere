import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';
import { URL } from 'url'; // Node.js's built-in URL module

// Load environment variables from .env file
config(); 

// Check if the DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the .env file');
}

// Parse the URL
const url = new URL(process.env.DATABASE_URL);

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: url.hostname,
    port: Number(url.port),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Removes the leading '/'
    ssl: false,
  },
} satisfies Config;
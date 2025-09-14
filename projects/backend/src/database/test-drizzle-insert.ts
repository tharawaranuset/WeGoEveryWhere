import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { refreshTokens } from './schema/refreshTokens.schema';

const client = postgres({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'mysupersecret',
  database: process.env.POSTGRES_DB || 'WEGO_EVERYWHERE_DB',
  ssl: false,
});

const db = drizzle(client);

async function testInsert() {
  try {
    console.log('Testing DB connection with:');
    console.log('Host:', process.env.POSTGRES_HOST || 'localhost');
    console.log('Port:', process.env.POSTGRES_PORT || '5432');
    console.log('User:', process.env.POSTGRES_USER || 'admin');
    console.log('Password:', process.env.POSTGRES_PASSWORD || 'mysupersecret');
    console.log('Database:', process.env.POSTGRES_DB || 'WEGO_EVERYWHERE_DB');

    const result = await db.insert(refreshTokens).values({
      id: Date.now(),
      userId: 3, // use a valid userId from your users table
      tokenHash: 'dummyhash',
      revoked: false,
      expiresAt: new Date(),
      createdAt: new Date(),
      createdByIp: '127.0.0.1'
    });
    console.log('Insert result:', result);
  } catch (err) {
    console.error('Drizzle insert error:', err);
  } finally {
    await client.end();
  }
}

testInsert();

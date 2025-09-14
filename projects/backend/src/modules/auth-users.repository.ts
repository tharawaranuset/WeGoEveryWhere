import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { authUsers } from '@backend/src/database/schema/authUsers.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthUsersRepository {
  private db;

  constructor(private readonly pool: Pool) {
    this.db = drizzle(this.pool);
  }

  async createAuthUser(userId: number, email: string, passwordHash: string) {
    const [row] = await this.db
      .insert(authUsers)
      .values({
        userId,
        email,
        passwordHash,
      })
      .returning({
        id: authUsers.id,
        userId: authUsers.userId,
        email: authUsers.email,
        createdAt: authUsers.createdAt,
      });
    return row;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, email))
      .limit(1);
    return user;
  }
}
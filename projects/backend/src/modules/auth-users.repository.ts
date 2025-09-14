import { Injectable } from '@nestjs/common';
import { authUsers } from '@backend/src/database/schema/authUsers.schema';
import { eq } from 'drizzle-orm';
import { db } from '@backend/src/database/connection';

@Injectable()
export class AuthUsersRepository {
  async createAuthUser(userId: number, email: string, passwordHash: string) {
    const [row] = await db
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
    const [user] = await db
      .select({
        id: authUsers.id,
        userId: authUsers.userId,
        email: authUsers.email,
        passwordHash: authUsers.passwordHash,
        createdAt: authUsers.createdAt,
        updatedAt: authUsers.updatedAt,
      })
      .from(authUsers)
      .where(eq(authUsers.email, email))
      .limit(1);
    return user;
  }
}
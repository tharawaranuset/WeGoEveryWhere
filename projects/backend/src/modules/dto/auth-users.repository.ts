// src/modules/auth-users.repository.ts
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { authUsers } from '@backend/src/database/schema/authUsers.schema';
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
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, email))
      .limit(1);
    return user;
  }
}
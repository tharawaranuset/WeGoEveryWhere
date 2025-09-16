// users.repository.ts
import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '@backend/src/database/schema/users.schema';
import { RegisterDto } from '@backend/src/modules/dto/register.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersRepository {
  async findById(userId: number) {
    // เลือกเฉพาะคอลัมน์ที่ต้องการ หรือ * ก็ได้
    const [row] = await this.db
      .select({
        userId: users.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        telephoneNumber: users.telephoneNumber,
        bio: users.bio,
        birthdate: users.birthdate,
        sex: users.sex,
        signupTime: users.signupTime,
        signupDate: users.signupDate,
        cookiePolicyVersionAccepted: users.cookiePolicyVersionAccepted,
        cookiePolicyAcceptedAt: users.cookiePolicyAcceptedAt,
      })
      .from(users)
      .where(eq(users.userId, userId));

    // ถ้าไม่พบจะ return undefined
    return row ?? null;
  }
  private db;

  constructor(private readonly pool: Pool) {
    this.db = drizzle(this.pool);
  }

  async createUser(input: RegisterDto) {
    const [row] = await this.db
      .insert(users)
      .values({
        firstName: input.firstName,
        lastName: input.lastName,
        telephoneNumber: input.telephoneNumber ?? null,
        bio: input.bio ?? null,
        birthdate: input.birthdate,
        sex: input.sex ?? null,
      })
      .returning({
        userId: users.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        telephoneNumber: users.telephoneNumber,
        bio: users.bio,
        birthdate: users.birthdate,
        sex: users.sex,
        signupTime: users.signupTime,
        signupDate: users.signupDate,
        cookiePolicyVersionAccepted: users.cookiePolicyVersionAccepted,
        cookiePolicyAcceptedAt: users.cookiePolicyAcceptedAt,
      });
    return row;
  }
}
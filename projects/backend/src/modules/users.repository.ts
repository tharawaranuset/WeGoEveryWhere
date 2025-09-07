// users.repository.ts
import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '@backend/src/database/schema/users.schema';

// Align these names with your users.schema.ts columns
type CreateUserDto = {
  firstName: string;
  lastName: string;
  telephoneNumber?: string | null;
  bio?: string | null;
  birthdate: string; // ISO date string
  sex?: string | null;
};

@Injectable()
export class UsersRepository {
  private db;

  constructor(private readonly pool: Pool) {
    this.db = drizzle(this.pool);
  }

  async createUser(input: CreateUserDto) {
    const {
      firstName, lastName, telephoneNumber, bio, birthdate, sex,
    } = input;

    const [row] = await this.db
      .insert(users)
      .values({
        firstName,
        lastName,
        telephoneNumber: telephoneNumber ?? null,
        bio: bio ?? null,
        birthdate,
        sex: sex ?? null,
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

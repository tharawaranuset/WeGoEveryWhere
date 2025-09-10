// users.repository.ts
import { Injectable } from '@nestjs/common';
import { drizzle,NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '@backend/src/database/schema/users.schema';
import { eq } from 'drizzle-orm';

// Align these names with your users.schema.ts columns
type CreateUserDto = {
  firstName: string;
  lastName: string;
  telephoneNumber?: string;
  bio?: string | null;
  birthdate: string; // ISO date string
  sex?: string;
};

type OAuthDerivedUserArgs = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
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
        telephoneNumber: telephoneNumber,
        bio: bio ?? null,
        birthdate,
        sex: sex,
        // signupDate / signupTime  set by DB.
        // cookiePolicyVersionAccepted: null,
        // cookiePolicyAcceptedAt: null,
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

  async findById(userId: number) {
      const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);
      return rows[0] ?? null;
  }

  async createUserFromOAuthTx(
    tx: NodePgDatabase, 
    args: OAuthDerivedUserArgs,
  ) {
    const firstName = args.firstName?.trim() || 'New';
    const lastName  = args.lastName?.trim()  || 'User';

    const insertValues: Record<string, any> = {
      firstName,
      lastName,
      telephoneNumber: null,
      bio: null,
      // birthdate: null,
      sex: null,
    };

    // If your users schema has `email`, these will be accepted.
    // If not, Drizzle/TS will complain at compile time.
    if ('email' in users) {
      insertValues.email = args.email ?? null;
    }
    if ('createdAt' in users) {
      insertValues.createdAt = new Date();
    }
    if ('updatedAt' in users) {
      insertValues.updatedAt = new Date();
    }

    const [row] = await tx
      .insert(users)
      .values(insertValues as any)
      .returning();

    return row!;
  }
}

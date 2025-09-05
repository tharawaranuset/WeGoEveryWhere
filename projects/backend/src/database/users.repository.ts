// users.repository.ts
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

// Align these names with your users.schema.ts columns
type CreateUserDto = {
  firstName: string;
  lastName: string;
  telephoneNumber?: string | null;
  bio?: string | null;
  age: number;
  sex?: string | null;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly pool: Pool) {}

  async createUser(input: CreateUserDto) {
    const {
      firstName, lastName, telephoneNumber, bio, age, sex,
    } = input;

    const sql = `
      INSERT INTO users (fname, lname, telephone_number, bio, age, sex)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING uid, fname AS "firstName", lname AS "lastName",
                telephone_number AS "telephoneNumber",
                bio, age, sex, signup_time AS "signupTime", signup_date AS "signupDate"
    `;

    const values = [
      firstName,
      lastName,
      telephoneNumber ?? null,
      bio ?? null,
      age,
      sex ?? null,
    ];

    const result = await this.pool.query(sql, values);
    return result.rows[0];
  }
}

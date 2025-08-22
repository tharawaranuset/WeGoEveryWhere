import { pgTable, serial, varchar, text, integer, time, date } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, sql } from 'drizzle-orm';

// User table schema
export const users = pgTable('users', {
  // Primary key - auto-generated
  uid: serial('uid').primaryKey(),
  firstName: varchar('fname', { length: 50 }).notNull(),
  lastName: varchar('lname', { length: 50 }).notNull(),
  telephoneNumber: varchar('telephone_number', { length: 20 }),
  bio: text('bio'),
  age: integer('age').notNull(),
  sex: varchar('sex', { length: 10 }),
  signupTime: time('signup_time').default(sql`CURRENT_TIME`),
  signupDate: date('signup_date').default(sql`CURRENT_DATE`),
});

// Type inference for TypeScript
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Validation helper types
export type CreateUserInput = Omit<NewUser, 'uid' | 'signupTime' | 'signupDate'>;
export type UpdateUserInput = Partial<Omit<NewUser, 'uid' | 'signupTime' | 'signupDate'>>;

// Column name mappings for reference
export const USER_COLUMNS = {
  UID: 'uid',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  TELEPHONE_NUMBER: 'telephoneNumber',
  BIO: 'bio',
  AGE: 'age',
  SEX: 'sex',
  SIGNUP_TIME: 'signupTime',
  SIGNUP_DATE: 'signupDate',
} as const;
import { pgTable, serial, varchar, text, integer, time, date,check,timestamp } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, sql } from 'drizzle-orm';

// User table schema
export const users = pgTable('users', {
  // Primary key - auto-generated
  userId: serial('user_id').primaryKey(),
  firstName: varchar('firstName', { length: 50 }).notNull(),
  lastName: varchar('lastName', { length: 50 }).notNull(),
  telephoneNumber: varchar('telephone_number', { length: 20 }),
  bio: text('bio'),
  birthdate: date('birthdate').notNull(),
  sex: varchar('sex', { length: 10 }),
  signupTime: time('signup_time').default(sql`CURRENT_TIME`),
  signupDate: date('signup_date').default(sql`CURRENT_DATE`),
  // ✅ cookie policy fields
  cookiePolicyVersionAccepted: varchar("cookie_policy_version_accepted", { length: 20 }),
  cookiePolicyAcceptedAt: timestamp("cookie_policy_accepted_at"),
}, (table) => [
  check("users_age_check", sql`${table.birthdate} <= CURRENT_DATE - INTERVAL '20 years'`)
]);


// Type inference for TypeScript
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Validation helper types
export type CreateUserInput = Omit<NewUser, 'userId' | 'signupTime' | 'signupDate'>;
export type UpdateUserInput = Partial<Omit<NewUser, 'userId' | 'signupTime' | 'signupDate'>>;

// Column name mappings for reference
export const USER_COLUMNS = {
  USER_ID: 'userId',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  TELEPHONE_NUMBER: 'telephoneNumber',
  BIO: 'bio',
  BIRTHDATE: 'birthdate',
  SEX: 'sex',
  SIGNUP_TIME: 'signupTime',
  SIGNUP_DATE: 'signupDate',
} as const;

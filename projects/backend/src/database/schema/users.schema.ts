import { pgTable, serial, varchar, text, integer, time, date, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const users = pgTable("users", {
  uid: serial("uid").primaryKey().notNull(),
  telephoneNumber: varchar("telephone_number", { length: 20 }),
  fname: varchar("fname", { length: 50 }).notNull(),
  lname: varchar("lname", { length: 50 }).notNull(),
  bio: text("bio"),
  age: integer("age"),
  sex: varchar("sex", { length: 10 }),
  signupTime: time("signup_time"),
  signupDate: date("signup_date"),

  // ✅ cookie policy fields
  cookiePolicyVersionAccepted: varchar("cookie_policy_version_accepted", { length: 20 }),
  cookiePolicyAcceptedAt: timestamp("cookie_policy_accepted_at"),
}, (table) => [
  check("users_age_check", sql`${table.age} > 20`),
]);
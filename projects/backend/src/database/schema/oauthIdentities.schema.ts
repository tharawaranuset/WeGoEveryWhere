import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users.schema"; 

export const oauth_identities = pgTable("oauth_identities", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id").notNull().references(() => users.userId), // FK
  provider: varchar("provider", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),// Unique ID from provider
  email: varchar("email", { length: 100 }),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").notNull(),
});

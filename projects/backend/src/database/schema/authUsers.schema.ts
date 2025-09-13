import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema";


export const authUsers = pgTable("auth_users", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id").notNull().references(() => users.userId).unique(), 
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

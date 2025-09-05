import { pgTable, serial, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema"; 

export const refresh_tokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id").notNull().references(() => users.uid), // FK
  tokenHash: varchar("token_hash", { length: 255 }).notNull(),
  revoked: boolean("revoked").default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  createdByIp: varchar("created_by_ip", { length: 50 }),
  userAgent: varchar("user_agent", { length: 255 }),
});

import { pgTable, integer, varchar, boolean, timestamp, bigint } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const refreshTokens = pgTable("refresh_tokens", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.userId), // FK
  tokenHash: varchar("token_hash", { length: 255 }).notNull(),
  revoked: boolean("revoked").default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  createdByIp: varchar("created_by_ip", { length: 50 }),
  userAgent: varchar("user_agent", { length: 255 })
});

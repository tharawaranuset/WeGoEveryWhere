import { pgTable, foreignKey, integer, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const admin = pgTable("admin", {
	userId: integer("user_id").primaryKey().notNull(),
	adminType: varchar("admin_type", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.userId],
		name: "admin_userId_fkey"
	}).onDelete("cascade"),
]);

import { pgTable, foreignKey, integer, serial, varchar, text } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const report = pgTable("report", {
	reportId: serial("report_id").primaryKey().notNull(),
	reportType: varchar("report_type", { length: 50 }),
	reportDetail: text("report_detail"),
	reportTopic: varchar("report_topic", { length: 100 }),
	userId: integer("user_id"),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.userId],
		name: "report_userId_fkey"
	}).onDelete("cascade"),
]);

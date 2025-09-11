import { pgTable, foreignKey, integer, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { event } from "./event.schema";

export const joined = pgTable("joined", {
	userId: integer("user_id").notNull(),
	eventId: integer("event_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.eventId],
		foreignColumns: [event.eventId],
		name: "joined_eventId_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.userId],
		name: "joined_userId_fkey"
	}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.eventId], name: "joined_pkey"}),
]);

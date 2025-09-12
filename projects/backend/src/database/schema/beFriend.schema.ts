import { pgTable, foreignKey, integer, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const beFriend = pgTable("be_friend", {
	userId: integer("user_id").notNull(),
	friendId: integer("friend_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.friendId],
		foreignColumns: [users.userId],
		name: "be_friend_friendId_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.userId],
		name: "be_friend_userId_fkey"
	}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.friendId], name: "be_friend_pkey"}),
]);

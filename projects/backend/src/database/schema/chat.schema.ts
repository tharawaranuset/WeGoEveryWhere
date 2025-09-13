import { pgTable, foreignKey, integer, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { chatDoc } from "./chatDoc.schema";

export const chat = pgTable("chat", {
	sender: integer("sender").notNull(),
	receiver: integer("receiver").notNull(),
	chatId: integer("chat_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.chatId],
		foreignColumns: [chatDoc.chatId],
		name: "chat_chatId_fkey"
	}),
	foreignKey({
		columns: [table.receiver],
		foreignColumns: [users.userId],
		name: "chat_receiver_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.sender],
		foreignColumns: [users.userId],
		name: "chat_sender_fkey"
	}).onDelete("cascade"),
	primaryKey({ columns: [table.sender, table.receiver, table.chatId], name: "chat_pkey"}),
]);

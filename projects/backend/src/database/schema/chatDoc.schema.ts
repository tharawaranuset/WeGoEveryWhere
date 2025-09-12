import { pgTable, serial, date, time, jsonb } from "drizzle-orm/pg-core";

export const chatDoc = pgTable("chat_doc", {
	chatId: serial("chat_id").primaryKey().notNull(),
	sdate: date("sdate"),
	stime: time("stime"),
	data: jsonb("data"),
});

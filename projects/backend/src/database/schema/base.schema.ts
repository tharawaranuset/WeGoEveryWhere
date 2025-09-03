import { pgTable, foreignKey, integer, varchar, serial, text, check, time, date, jsonb, index, numeric, doublePrecision, primaryKey } from "drizzle-orm/pg-core"
import { users } from "./users.schema";
import { event } from "./event.schema";



export const admin = pgTable("admin", {
	uid: integer().primaryKey().notNull(),
	adminType: varchar("admin_type", { length: 50 }),
}, (table) => [
	foreignKey({
			columns: [table.uid],
			foreignColumns: [users.uid],
			name: "admin_uid_fkey"
		}).onDelete("cascade"),
]);

export const report = pgTable("report", {
	rid: serial().primaryKey().notNull(),
	reportType: varchar("report_type", { length: 50 }),
	reportDetail: text("report_detail"),
	reportTopic: varchar("report_topic", { length: 100 }),
	uid: integer(),
}, (table) => [
	foreignKey({
			columns: [table.uid],
			foreignColumns: [users.uid],
			name: "report_uid_fkey"
		}).onDelete("cascade"),
]);



export const chatDoc = pgTable("chat_doc", {
	cid: serial().primaryKey().notNull(),
	sdate: date(),
	stime: time(),
	data: jsonb(),
});





export const beFriend = pgTable("be_friend", {
	uid: integer().notNull(),
	fid: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fid],
			foreignColumns: [users.uid],
			name: "be_friend_fid_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.uid],
			foreignColumns: [users.uid],
			name: "be_friend_uid_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.uid, table.fid], name: "be_friend_pkey"}),
]);

export const joined = pgTable("joined", {
	uid: integer().notNull(),
	eid: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eid],
			foreignColumns: [event.eid],
			name: "joined_eid_fkey"
		}),
	foreignKey({
			columns: [table.uid],
			foreignColumns: [users.uid],
			name: "joined_uid_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.uid, table.eid], name: "joined_pkey"}),
]);

export const chat = pgTable("chat", {
	sender: integer().notNull(),
	receiver: integer().notNull(),
	cid: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cid],
			foreignColumns: [chatDoc.cid],
			name: "chat_cid_fkey"
		}),
	foreignKey({
			columns: [table.receiver],
			foreignColumns: [users.uid],
			name: "chat_receiver_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sender],
			foreignColumns: [users.uid],
			name: "chat_sender_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.sender, table.receiver, table.cid], name: "chat_pkey"}),
]);
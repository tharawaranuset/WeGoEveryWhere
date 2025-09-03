import { pgTable, foreignKey, integer, varchar, serial, text, check, time, date, jsonb, index, numeric, doublePrecision, primaryKey } from "drizzle-orm/pg-core"
import { users } from "./users.schema";



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

export const event = pgTable("event", {
	eid: serial().primaryKey().notNull(),
	cost: numeric({ precision: 10, scale:  2 }).$type<number>().default(0.00),
	name: varchar({ length: 100 }).notNull(),
	date: date(),
	time: time(),
	place: varchar({ length: 100 }),
	capacity: integer().notNull(),
	detail: text(),
	rating: doublePrecision().default(0),
	uid: integer(),
}, (table) => [
	index("idx_events_start_time").using("btree", table.date.asc().nullsLast().op("date_ops")),
	foreignKey({
			columns: [table.uid],
			foreignColumns: [users.uid],
			name: "event_uid_fkey"
		}).onDelete("cascade"),
]);

export const participant = pgTable("participant", {
	uid: integer().primaryKey().notNull(),
	credit: integer().default(0),
	status: varchar({ length: 20 }),
}, (table) => [
	foreignKey({
			columns: [table.uid],
			foreignColumns: [users.uid],
			name: "participant_uid_fkey"
		}).onDelete("cascade"),
]);

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
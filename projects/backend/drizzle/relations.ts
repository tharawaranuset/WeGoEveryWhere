import { relations } from "drizzle-orm/relations";
import { users, admin, report, event, participant, beFriend, joined, chatDoc, chat } from "../db/schema";

export const adminRelations = relations(admin, ({one}) => ({
	user: one(users, {
		fields: [admin.uid],
		references: [users.uid]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	admins: many(admin),
	reports: many(report),
	events: many(event),
	participants: many(participant),
	beFriends_fid: many(beFriend, {
		relationName: "beFriend_fid_users_uid"
	}),
	beFriends_uid: many(beFriend, {
		relationName: "beFriend_uid_users_uid"
	}),
	joineds: many(joined),
	chats_receiver: many(chat, {
		relationName: "chat_receiver_users_uid"
	}),
	chats_sender: many(chat, {
		relationName: "chat_sender_users_uid"
	}),
}));

export const reportRelations = relations(report, ({one}) => ({
	user: one(users, {
		fields: [report.uid],
		references: [users.uid]
	}),
}));

export const eventRelations = relations(event, ({one, many}) => ({
	user: one(users, {
		fields: [event.uid],
		references: [users.uid]
	}),
	joineds: many(joined),
}));

export const participantRelations = relations(participant, ({one}) => ({
	user: one(users, {
		fields: [participant.uid],
		references: [users.uid]
	}),
}));

export const beFriendRelations = relations(beFriend, ({one}) => ({
	user_fid: one(users, {
		fields: [beFriend.fid],
		references: [users.uid],
		relationName: "beFriend_fid_users_uid"
	}),
	user_uid: one(users, {
		fields: [beFriend.uid],
		references: [users.uid],
		relationName: "beFriend_uid_users_uid"
	}),
}));

export const joinedRelations = relations(joined, ({one}) => ({
	event: one(event, {
		fields: [joined.eid],
		references: [event.eid]
	}),
	user: one(users, {
		fields: [joined.uid],
		references: [users.uid]
	}),
}));

export const chatRelations = relations(chat, ({one}) => ({
	chatDoc: one(chatDoc, {
		fields: [chat.cid],
		references: [chatDoc.cid]
	}),
	user_receiver: one(users, {
		fields: [chat.receiver],
		references: [users.uid],
		relationName: "chat_receiver_users_uid"
	}),
	user_sender: one(users, {
		fields: [chat.sender],
		references: [users.uid],
		relationName: "chat_sender_users_uid"
	}),
}));

export const chatDocRelations = relations(chatDoc, ({many}) => ({
	chats: many(chat),
}));
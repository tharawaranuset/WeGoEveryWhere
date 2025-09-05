import { pgTable, foreignKey, integer, varchar, serial, text, check, time, date, jsonb, index, numeric, doublePrecision } from "drizzle-orm/pg-core"
import { users } from "./users.schema";



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
import { pgTable, foreignKey, integer, varchar, serial, text, check, time, date, jsonb, index, numeric, doublePrecision } from "drizzle-orm/pg-core"
import { users } from "./users.schema";



export const event = pgTable("event", {
    eventId: serial("event_id").primaryKey().notNull(),
    cost: numeric("cost",{ precision: 10, scale:  2 }).$type<number>().default(0.00),
    name: varchar("name", { length: 100 }).notNull(),
    date: date("date").notNull(),
    time: time("time").notNull(),
    place: varchar("place", { length: 100 }),
    capacity: integer("capacity").notNull(),
    detail: text("detail").notNull(),
    rating: doublePrecision("rating").default(0),
    status: varchar("status").notNull().default('active'),
    userId: integer("user_id").notNull(),
}, (table) => [
    index("idx_events_start_time").using("btree", table.date.asc().nullsLast().op("date_ops")),
    foreignKey({
            columns: [table.userId],
            foreignColumns: [users.userId],
            name: "event_userId_fkey"
        }).onDelete("cascade"),
]);
import { pgTable, varchar, integer, foreignKey} from "drizzle-orm/pg-core";
import { users } from "./users.schema";



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
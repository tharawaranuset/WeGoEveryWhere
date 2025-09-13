import { pgTable, varchar, integer, foreignKey} from "drizzle-orm/pg-core";
import { users } from "./users.schema";



export const participant = pgTable("participant", {
    userId: integer("user_id").primaryKey().notNull(),
    credit: integer("credit").default(0),
    status: varchar("status", { length: 20 }),
}, (table) => [
    foreignKey({
            columns: [table.userId],
            foreignColumns: [users.userId],
            name: "participant_userId_fkey"
        }).onDelete("cascade"),
]);
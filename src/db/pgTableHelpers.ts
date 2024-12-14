
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export function now() {
  return sql<string>`now()`;
}

export const timestampObj = {
    updatedAt: timestamp("updated_at", {
        mode: "string",
        precision: 3,
    })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
    createdAt: timestamp("created_at", {
        mode: "string",
        precision: 3,
    })
    .notNull()
    .defaultNow(),
};

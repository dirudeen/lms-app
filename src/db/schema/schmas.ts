import { sql } from "drizzle-orm";
import { text, pgTable, numeric, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { db } from "..";


export const course = pgTable('Course', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  price: numeric('price', {precision: 12, scale: 2}),
  isPublished: boolean("isPublished").default(false),
  categoryId: text("categoryId"),

  attachment: text("attachment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
  
  
});


export const attachment = pgTable("Attachments", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    courseId: uuid("courseId").notNull().references(() => course.id, {onDelete: "cascade"}),
    url: text("url")

})


import { sql } from "drizzle-orm";
import { text, pgTable, numeric, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod"
import { z } from "zod";

export const course = pgTable('Course', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  price: numeric('price', {precision: 12, scale: 2}),
  isPublished: boolean("isPublished").default(false),

  categoryId: uuid("categoryId").references(() => category.id),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

export const category = pgTable("Category", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
})


export const attachment = pgTable("Attachment", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    courseId: uuid("courseId").notNull().references(() => course.id, {onDelete: "cascade"}),
    url: text("url"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull()

})

// Schema for inserting a course 
export const insertCourseSchema = createInsertSchema(course, {
  title: z.string().min(1, {message: "Title must be at least 3 characters"}),
  userId: z.string()
})

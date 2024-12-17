import { relations, sql } from "drizzle-orm";
import { boolean, index, integer, numeric, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestampObj } from "./pgTableHelpers";


export const courseTable = pgTable('Course', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", {length: 255}).notNull(),
  title: varchar("title", {length: 100}).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  price: numeric('price', {precision: 12, scale: 2}),
  isPublished: boolean("is_published").default(false),
  categoryId: uuid("category_id").references(() => categoryTable.id),
    ...timestampObj
}, (table) => {
    return {
        courseTableIdx: index("course_table_idx").on(table.id)
    }
});

export const courseRelations = relations(courseTable, ({many}) => ({
    attachments: many(attachmentTable), 
    chapters: many(chapterTable),
}))

export const categoryTable = pgTable("Category", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", {length: 255}).notNull(),
  }, (table) => {
      return {
        categoryTableIdx: index("category_table_idx").on(table.id)
      }
  })
  

export const attachmentTable = pgTable("Attachment", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    courseId: uuid("course_id").notNull().references(() => courseTable.id, {onDelete: "cascade"}),
    url: varchar("url", {length: 255}).notNull(),
    name: varchar("name", {length: 255}).notNull(),
    ...timestampObj
}, (table) =>{
    return {
        attachmentTableIdx: index("attachment_table_idx").on(table.id),
        attachmentTableCourseIdx: index("attachment_table_course_idx").on(table.courseId)
    }
})

export const attachmentRelations = relations(attachmentTable, ({one}) => ({
    course: one(courseTable,{
        fields: [attachmentTable.courseId],
        references: [courseTable.id]
    })
}))

export const chapterTable = pgTable("Chapter", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", {length: 255}).notNull(),
    description: text("description"),
    videoUrl: varchar("video_url", {length: 255}),
    position: integer("position").notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    isFree: boolean("is_free").default(false).notNull(),
    courseId: uuid("course_id").notNull().references(() => courseTable.id, {onDelete: "cascade"}),
    ...timestampObj
}, (table) => {
    return {
        chapterTableCourseIdx: index("chapter_table_course_idx").on(table.courseId)
    }
})

export const chapterRelations = relations(chapterTable, ({one, many}) => ({
    course: one(courseTable, {
        fields: [chapterTable.courseId],
        references: [courseTable.id]
    }),
    muxData: one(muxDataTable)
}))

export const muxDataTable = pgTable("MuxData", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id", {length: 255}).notNull(),
  playbackId: varchar("playback_id", {length: 255}),
  chapterId: uuid("chapter_id").notNull().unique().references(() => chapterTable.id, {onDelete: "cascade"}),
});

export const muxDataRelations = relations(muxDataTable, ({one, many}) => ({
    chapter: one(chapterTable, {
        fields: [muxDataTable.chapterId],
        references: [chapterTable.id],
    })
}))

export const userProgressTable = pgTable("UserProgress", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id", {length: 255}).notNull().unique(),
    chapterId: uuid("chapter_id").unique().notNull().references(() => chapterTable.id, {onDelete: "cascade"}),
    isCompleted: boolean("is_completed").default(false).notNull(),
    ...timestampObj
}, (table) => {
    return {
        userProgressTableChapterIdx: index("user_progress_table_chapter_idx").on(table.chapterId),
    }
})

export const puchaseTable = pgTable("Purchase", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id", {length: 255}).notNull(),
    courseId: uuid("course_id").notNull().references(() => courseTable.id, {onDelete: "cascade"}),
    ...timestampObj,
}, (table) => {
    return {
        puchaseTableCourseIdx: index("puchase_table_course_idx").on(table.courseId),
    }
})

export const stripeCustomerTable = pgTable("StripeCustomer", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id", {length: 255}).notNull().unique(),
    stripeCustomerId: varchar("stripe_customer_id", {length: 255}).notNull().unique(),
    ...timestampObj,
})

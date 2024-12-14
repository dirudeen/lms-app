import {
 attachmentTable,
 courseTable,
} from "@/db/schema";
import { createInsertSchema,  } from "drizzle-zod";
import * as z from "zod";


export const insertCourseSchema = createInsertSchema(courseTable, {
  title: z.string().min(1, {message: "Title must be at least 3 characters"}),
  userId: z.string(),
  description: z.string().min(1, {message: "Description is required"}),
  imageUrl: z.string().min(1, {message: "Image url is required"}),
  categoryId: z.string().min(1, {message: "Category field is required"}),
  price: z.string()
})

// pick a title only from the insertCourseSchema
export const titleInputValidation = insertCourseSchema.pick({ title: true });
export const descriptionInputValidation = insertCourseSchema.pick({
  description: true,
});
export const imageUrlInputValidation = insertCourseSchema.pick({
  imageUrl: true,
});
export const categoryInputValidation = insertCourseSchema.pick({
  categoryId: true,
});
export const priceInputValidation = insertCourseSchema.pick({ price: true });

export type Course = typeof courseTable.$inferSelect;

// attachment select type
export type Attachment = typeof attachmentTable.$inferSelect;

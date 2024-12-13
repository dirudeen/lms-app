import {
  attachment as attachmentTable,
  course as courseTable,
  insertCourseSchema,
} from "@/db/schema/schmas";

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

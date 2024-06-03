import {insertCourseSchema} from "@/db/schema/schmas" 

// pick a title only from the insertCourseSchema
export const titleInputValidation = insertCourseSchema.pick({title: true})
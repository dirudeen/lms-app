import {insertCourseSchema} from "@/db/schema/schmas" 
import { z } from "zod"

// pick a title only from the insertCourseSchema
export const titleInputValidation = insertCourseSchema.pick({title: true})
export const descriptionInputValidation = insertCourseSchema.pick({description: true})

const updateCourse = insertCourseSchema.omit({userId: true})
export type Course = z.infer<typeof updateCourse>
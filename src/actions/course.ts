"use server";
import { db } from "@/db";
import { course as courseTable } from "@/db/schema/schmas";
import { auth } from "@clerk/nextjs/server";
import { insertCourseSchema } from "@/db/schema/schmas";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";



export async function createCourse({ title }: { title: string }) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unautherized");
  }
  // validate the title and userId before inserting to db
  const validatedCourseDraft = insertCourseSchema.parse({
    title,
    userId
  })
  console.log({title, userId})
  try {
    const course = await db
    .insert(courseTable)
    .values(validatedCourseDraft)
    .returning()
    .then(res => res[0])

    return course;
  } catch (error) {
    console.log(["COURSE CREATION", error]);
    throw new Error("Failed to create a course");
  }
}


export async function fetchCourse(courseId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unautherized");
  }

  try {
    const course = await db
    .select()
    .from(courseTable)
    .where(and(eq(courseTable.userId, userId), eq(courseTable.id, courseId)))
    .then(res => res[0])

    if (!course) {
      redirect("/")
    }
    return course;
  } catch (error) {
    console.log(["GET COURSES", error]);
    throw new Error("Failed to get courses");
  }
}

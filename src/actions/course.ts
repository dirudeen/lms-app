"use server";
import { db } from "@/db";
import {
attachmentTable,
categoryTable,
chapterTable,
courseTable,
} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { insertCourseSchema } from "@/types/index";
import { eq, and, asc, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Course } from "@/types";

type CourseSelect = typeof courseTable.$inferSelect;
type Attachment = typeof attachmentTable.$inferSelect;
type Chapters = typeof chapterTable.$inferSelect;

export async function createCourse({ title }: { title: string }) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unautherized");
  }
  // validate the title and userId before inserting to db
  const validatedCourseDraft = insertCourseSchema.parse({
    title,
    userId,
  });
  console.log({ title, userId });
  try {
    const course = await db
      .insert(courseTable)
      .values(validatedCourseDraft)
      .returning()
      .then((res) => res[0]);

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
    const rows = await db
      .select()
      .from(courseTable)
      .leftJoin(attachmentTable, eq(courseTable.id, attachmentTable.courseId))
      .leftJoin(chapterTable, eq(chapterTable.courseId, courseId))
      .orderBy(desc(attachmentTable.createdAt))
      .where(and(eq(courseTable.userId, userId), eq(courseTable.id, courseId)));

    const result = rows.reduce<{
      course: CourseSelect;
      attachments: Attachment[];
      chapters: Chapters[];
    }>(
      (acc, row) => {
        if (!acc.course) {
          acc.course = row.Course;
          acc.attachments = [];
          acc.chapters = [];
        }
        if (row.Attachment) {
          acc.attachments.push(row.Attachment);
        }

        if(row.Chapter) {
          acc.chapters.push(row.Chapter)
        }

        return acc;
      },
      { course: rows[0]?.Course || null, attachments: [], chapters: [] }
    );

    if (!result.course) {
      redirect("/");
    }
    console.log(result)
    return result;
  } catch (error) {
    console.log(["GET COURSES", error]);
    throw new Error("Failed to get courses");
  }
}

interface UpdateCourseProps {
  values: {
    [key in keyof Course]?: Course[key];
  };
  courseId: string;
  path: string;
}
export async function updateCourse({
  values,
  courseId,
  path,
}: UpdateCourseProps) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unautherized");
  }

  try {
    const updatedCourse = await db
      .update(courseTable)
      .set(values)
      .where(and(eq(courseTable.userId, userId), eq(courseTable.id, courseId)))
      .returning()
      .then((res) => res[0]);
    revalidatePath(path);
    
    return updatedCourse;
  } catch (error) {
    console.log(["UPDATE COURSE", error]);
    throw new Error("Failed to update the course");
  }
}

export const fetchCategories = async () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unautherized");
  }

  try {
    const categories = await db
      .select()
      .from(categoryTable)
      .orderBy(asc(categoryTable.name))
      .then((res) => res);
    return categories;
  } catch (error) {
    console.log(["GET CATEGORIES", error]);
    throw new Error("Failed to get categories");
  }
};

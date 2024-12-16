"use server";

import { db } from "@/db";
import { chapterTable, courseTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";

interface CreateChapterProps {
  courseId: string;
  values: {
    title: string;
  };
  path: string;
}

const titleSchema = z
  .string()
  .min(3, { message: "Title must be at least 3 characters" });

export async function createChapter({
  courseId,
  values,
  path,
}: CreateChapterProps) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unautherized");
  }
  try {
    // validate the title before inserting to db
    const pasrsedTitle = titleSchema.parse(values.title);

    // verify the course owner is the authenticated user
    const course = await db
      .select()
      .from(courseTable)
      .where(and(eq(courseTable.id, courseId), eq(courseTable.userId, userId)))
      .then((res) => res[0]);
    if (!course) {
      throw new Error("Unautherized");
    }
    // fetch the last chapter to know where to insert the new chapter
    const lastChapter = await db
      .select()
      .from(chapterTable)
      .where(eq(chapterTable.courseId, courseId))
      .orderBy(desc(chapterTable.position))
      .then((res) => res[0]);

    const newPosition = lastChapter ? lastChapter.position + 1 : 0;

    // insert the new chapter
    await db.insert(chapterTable).values({
      title: pasrsedTitle,
      position: newPosition,
      courseId: courseId,
    });
    revalidatePath(path);
  } catch (error) {
    console.log("CREATE CHAPTER", error);
    throw new Error("Failed to create a chapter");
  }
}

interface UpdateChaptersOrderProps {
  items: {id: string, position: number}[]
  courseId: string
}

export async function updateChaptersOrder({items, courseId}: UpdateChaptersOrderProps ) {

  const {userId} = auth()

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const course = await db
    .select()
    .from(courseTable)
    .where(and(eq(courseTable.id, courseId), eq(courseTable.userId, userId)))
    .then((res) => res[0]);
  if (!course) {
    throw new Error("Unautherized");
  }
  // update all the chapters position
  for (const item of items) {
    await db.update(chapterTable).set({position: item.position}).where(eq(chapterTable.id, item.id))
  }
  } catch (error) {
    console.log("UPDATE CHAPTERS ORDER", error);
    throw new Error("Failed to update the chapter order");
  }

}

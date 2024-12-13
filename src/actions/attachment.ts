"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import {
    attachment as attachmentTable,
    course as courseTable
} from "@/db/schema/schmas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { deleteUTFile } from "./uploadthing-action";

interface CreateAttachmentProps {
  courseId: string;
  path: string;
  values: {
    url: string;
    name: string;
  };
}

export async function createAttachment({
  courseId,
  path,
  values,
}: CreateAttachmentProps) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unautherized");
  }

  try {
    const { courseOwner } = await db
      .select({ courseOwner: courseTable.userId })
      .from(courseTable)
      .where(eq(courseTable.id, courseId))
      .then((res) => res[0]);

    if (courseOwner !== userId) {
      throw new Error("Course not found");
    }

    await db.insert(attachmentTable).values({ courseId, ...values });
    revalidatePath(path);
    return;
  } catch (error) {
    console.log("CREATE ATTACHMENT ERROR", error);
    throw new Error("Error creating attachment");
  }
}

interface DeleteAttachmentProps {
  attachmentId: string;
  courseId: string;
  path: string;
  url: string;
}

export async function deleteAttachment({attachmentId, courseId, path, url }: DeleteAttachmentProps) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unautherized");
  }

  try {
    const { courseOwner } = await db
      .select({ courseOwner: courseTable.userId })
      .from(courseTable)
      .where(eq(courseTable.id, courseId))
      .then((res) => res[0]);

    if (courseOwner !== userId) {
      throw new Error("Course not found");
    }
    await db.delete(attachmentTable).where(eq(attachmentTable.id, attachmentId));
    await deleteUTFile(url);
    revalidatePath(path);
    return;
} catch (error) {
    console.log("DELETE ATTACHMENT ERROR", error);
    throw new Error("Error deleting attachment");
}

}
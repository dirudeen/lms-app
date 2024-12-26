"use server";
import { db } from "@/db";
import { userProgressTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface UpdateUserProgressParams {
  courseId: string;
  chapterId: string;
  isCompleted?: boolean;
  path: string;
}

export async function updateUserProgress({
  courseId,
  chapterId,
  isCompleted,
  path,
}: UpdateUserProgressParams) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    await db
      .insert(userProgressTable)
      .values({
        isCompleted: isCompleted,
        userId,
        chapterId,
      })
      .onConflictDoUpdate({
        target: userProgressTable.chapterId,
        set: { isCompleted: isCompleted },
      });
    revalidatePath(path);
  } catch (error) {
    console.log("[UPATE USER PROGRESS ERROR]", error);
    throw new Error("Something went wrong");
  }
}

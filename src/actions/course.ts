"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const { userId } = auth();

export async function createCourse({ title }: { title: string }) {
  if (!userId) {
    throw new Error("Unautherized");
  }

  try {
    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });
    return course;
  } catch (error) {
    console.log(["COURSE CREATION", error]);
    throw new Error("Failed to create a course");
  }
}

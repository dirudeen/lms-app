"use server";

import { auth } from "@clerk/nextjs/server";

const { userId } = auth();

export async function createCourse({ title }: { title: string }) {
  if (!userId) {
    throw new Error("Unautherized");
  }

  try {
    const course = {};
    return course;
  } catch (error) {
    console.log(["COURSE CREATION", error]);
    throw new Error("Failed to create a course");
  }
}

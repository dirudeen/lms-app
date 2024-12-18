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
import Mux from "@mux/mux-node";
import { deleteUTFile } from "./uploadthing-action";

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
    const course = await db.query.courseTable.findFirst({
      with: {
        attachments: true,
        chapters: true,
      },
      where: and(eq(courseTable.id, courseId), eq(courseTable.userId, userId)),
      orderBy: desc(attachmentTable.createdAt),
    });

    if (!course) {
      redirect("/");
    }
    return course;
  } catch (error) {
    console.log(["GET COURSES", error]);
    throw new Error("Failed to get courses");
  }
}

interface UpdateCourseProps {
  values: Partial<Course>;
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

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

interface DeleteCourseProps {
  courseId: string;
}

export async function deleteCourse({ courseId }: DeleteCourseProps) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unautherized");

    const course = await db.query.courseTable.findFirst({
      with: { chapters: { with: { muxData: true } } },
      where: and(eq(courseTable.id, courseId), eq(courseTable.userId, userId)),
    });

    if (!course) throw new Error("Course not found");

    if (course.chapters.length !== 0) {
      // delete the assets stored in mux and uploadthing
      for (const chapter of course.chapters) {
        if (chapter.videoUrl && chapter.muxData) {
          await video.assets.delete(chapter.muxData.assetId);
          await deleteUTFile(chapter.videoUrl);
        }
      }
    }
    // delete the course from the database
    await db.delete(courseTable).where(eq(courseTable.id, courseId));
  } catch (error) {
    console.log("DELETE COURSE", error);
    throw new Error("Failed to delete the course");
  }
}

interface PublishCourseProps {
  courseId: string;
  path: string;
}

export async function publishCourse({ courseId, path }: PublishCourseProps) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unautherized");

    const course = await db.query.courseTable.findFirst({
      with: { chapters: true },
      where: and(eq(courseTable.id, courseId), eq(courseTable.userId, userId)),
    });

    if (!course) throw new Error("Course not found");

    const hasPublishedChapters = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.categoryId,
      course.price,
      hasPublishedChapters,
    ];

    const requiredFieldsAreFullfilled = requiredFields.every(Boolean);

    if (!requiredFieldsAreFullfilled)
      throw new Error("Missing required fields");
    await db
      .update(courseTable)
      .set({ isPublished: true })
      .where(eq(courseTable.id, courseId));
    revalidatePath(path);
  } catch (error) {
    console.log("PUBLISH COURSE ERROR", error);
    throw new Error("Failed to publish course");
  }
}

interface UnpublishCourseProps {
  courseId: string;
  path: string;
}

export async function unPublishCourse({
  courseId,
  path,
}: UnpublishCourseProps) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unautherized");

    const course = await db.query.courseTable.findFirst({
      where: and(eq(courseTable.id, courseId), eq(courseTable.userId, userId)),
    });

    if (!course) throw new Error("Course not found");

    await db
      .update(courseTable)
      .set({ isPublished: false })
      .where(eq(courseTable.id, courseId));
    revalidatePath(path);
  } catch (error) {
    console.log("UNPUBLISH COURSE ERROR", error);
    throw new Error("Failed to unpublish course");
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

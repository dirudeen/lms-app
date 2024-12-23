import { fetchProgress } from "@/actions/chapters";
import { getCourseWithChaptersAndProgress } from "@/actions/course";
import React from "react";
import CourseSidebar from "./_components/courseSidebar";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {

    const courseId = params.courseId;
    const course = await getCourseWithChaptersAndProgress({courseId})
    const progressCount = await fetchProgress(courseId)
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
          />
      </div>
      <main>{children}</main>
    </div>
  );
}

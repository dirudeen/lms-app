import { getCourseWithChapters } from "@/actions/course";
import { redirect } from "next/navigation";

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
  const courseId = params.courseId;
  const course = await getCourseWithChapters({ courseId });

  return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
}

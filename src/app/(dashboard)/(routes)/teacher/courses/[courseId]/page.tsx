import { fetchCourse } from "@/actions/course";
import { IconBadge } from "@/components/IconBadge";
import { LayoutDashboard } from "lucide-react";

interface Props {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({ params: { courseId } }: Props) {
  const course = await fetchCourse(courseId);

  // fields to complete
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields} / ${totalFields}`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

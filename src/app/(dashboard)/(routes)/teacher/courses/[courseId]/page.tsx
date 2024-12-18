import { fetchCategories, fetchCourse } from "@/actions/course";
import { IconBadge } from "@/components/IconBadge";
import {
  CheckCircleIcon,
  CircleDollarSign,
  DollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { TitleForm } from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { CategoryForm } from "./_components/CategoryForm";
import { PriceForm } from "./_components/PriceForm";
import { AttachmentForm } from "./_components/AttachmentForm";
import { ChaptersForm } from "./_components/ChaptersForm";
import Banner from "@/components/banner";
import Actions from "./_components/actions";

interface Props {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({ params: { courseId } }: Props) {
  const course = await fetchCourse(courseId);
  const categories = await fetchCategories();
  const transformedCategories = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  // fields to complete
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.price,
    course.chapters.some(chapter => chapter.isPublished)
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields} / ${totalFields}`;
  const isComplete = requiredFields.every(Boolean)
  return (
    <>
    {!course.isPublished && (
      <Banner 
      label="This course is not published yet. It will not be visible to your students"
      />
    )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
        <Actions 
          courseId={courseId}
          disabled={!isComplete}
          isPublished={course.isPublished}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-x-4">
        <section>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm courseId={course.id} initialData={course} />
          <CategoryForm
            courseId={course.id}
            initialData={course}
            options={transformedCategories}
          />
        </section>
        <div className="space-y-4">
          <section>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course chapers</h2>
            </div>
            <ChaptersForm initialData={course} courseId={course.id} />
          </section>
          <section>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm courseId={course.id} initialData={course} />
          </section>
          <section>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources and Attachments</h2>
            </div>
            <AttachmentForm
              initialData={course}
              courseId={courseId}
            />
          </section>
        </div>
      </div>
    </div>
    </>
  );
}

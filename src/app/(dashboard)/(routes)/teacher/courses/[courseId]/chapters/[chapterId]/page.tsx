import { fetchChapter } from "@/actions/chapters";
import { IconBadge } from "@/components/IconBadge";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ChapterTitleForm } from "./_components/chapterTitleForm";
import { ChapterDescriptionForm } from "./_components/chapterDescriptionForm";
import { ChapterAccessForm } from "./_components/chapterAccessForm";

interface Props {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default async function ChapterPage({
  params: { chapterId, courseId },
}: Props) {
  const chapter = await fetchChapter({ chapterId, courseId });

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const requiredFieldsLength = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${requiredFieldsLength})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="flex items-center gap-2 text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="size-4" />
            <p>Back to course setup</p>
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-6">
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl ">Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl ">Access Settings</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

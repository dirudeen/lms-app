import { getCourseDetailsWithChapterData } from "@/actions/chapters";
import { getCourseWithChapters } from "@/actions/course";
import Banner from "@/components/banner";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/videoPlayer";
import CourseEnrollBotton from "./_components/courseEnrollButton";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/courseProgressButton";

interface ChapterIdPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default async function ChapterIdPage({ params }: ChapterIdPageProps) {
  const { courseId, chapterId } = params;

  const {
    course,
    chapter,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getCourseDetailsWithChapterData({ courseId, chapterId });

  if (!chapter || !course) redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && userProgress?.isCompleted;
  const price = parseFloat(course?.price!);
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant={"success"} label={"You have completed this chapter"} />
      )}
      {isLocked && (
        <Banner
          variant={"warning"}
          label="You need to purchase this course to access this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            courseId={courseId}
            title={chapter.title}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-2xl font-semibold mb-2">{chapter.title}</h1>
            {purchase ? (
              <div>
                <CourseProgressButton 
                courseId={courseId}
                chapterId={chapterId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
                />
              </div>
            ):
            (<CourseEnrollBotton
              courseId={courseId}
              price={price}
              
            />)}
          </div>
          <Separator />
          <div>
            <Preview
              value={chapter.description!}
            />
          </div>
          {!!attachments.length && (
            <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a 
                href={attachment.url}
                target="_blank"
                key={attachment.id}
                className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                >
                  <File />
                  <p className="line-clamp-1">
                    {attachment.name}
                  </p>
                </a>
              ))}
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

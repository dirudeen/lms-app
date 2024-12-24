import { getCourseDetailsWithChapterData } from "@/actions/chapters";
import { getCourseWithChapters } from "@/actions/course";
import Banner from "@/components/banner";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/videoPlayer";

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
      </div>
    </div>
  );
}

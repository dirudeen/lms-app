"use client";

import { updateUserProgress } from "@/actions/userProgress";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  chapterId: string;
  courseId: string;
  title: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  nextChapterId: any;
  playbackId: string;
}

export default function VideoPlayer({
  chapterId,
  courseId,
  title,
  isLocked,
  completeOnEnd,
  nextChapterId,
  playbackId,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const confetti = useConfettiStore();

  const onEndHandler = async () => {
    try {
      if (completeOnEnd) {
        await updateUserProgress({
          courseId,
          chapterId,
          isCompleted: true,
          path,
        });
        if (!nextChapterId) {
          confetti.onOpen();
        }
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
        toast.success("Progress updated");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="relative aspect-video">
      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="size-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="size-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          className={cn("absolute h-full", !isReady && "hidden")}
          title={title}
          onCanPlay={() => setIsReady((prev) => !prev)}
          onEnded={onEndHandler}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
}

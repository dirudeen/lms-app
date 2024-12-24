"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
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
          className={cn(
            "absolute h-full",
            !isReady && "hidden")}
          title={title}
          onCanPlay={() => setIsReady((prev) => !prev)}
          onEnded={() => {}}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
}

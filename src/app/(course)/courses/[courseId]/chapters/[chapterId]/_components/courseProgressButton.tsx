"use client";

import { updateUserProgress } from "@/actions/userProgress";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { CheckCircle, XCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}

export default function CourseProgressButton({
  courseId,
  chapterId,
  nextChapterId,
  isCompleted,
}: CourseProgressButtonProps) {
  const Icon = isCompleted ? XCircle : CheckCircle;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();
  const confetti = useConfettiStore();

  const clickHandler = async () => {
    setIsLoading(true);
    try {
      await updateUserProgress({
        courseId,
        chapterId,
        isCompleted: !isCompleted,
        path,
      });
      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      toast.success("Progress updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={clickHandler}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? "outline" : "success"}
    >
      {isCompleted ? "Not Completed" : "Mark as Complete"}
      <Icon className="size-4 ml-2" />
    </Button>
  );
}

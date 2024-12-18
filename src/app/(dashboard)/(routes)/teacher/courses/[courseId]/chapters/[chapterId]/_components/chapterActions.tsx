"use client";
import { deleteChapter } from "@/actions/chapters";
import { ConfirmModal } from "@/components/modals/confirmModal";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
  courseId: string;
  chapterId: string;
  disabled: boolean;
  isPublished: boolean;
}

export default function ChapterActions({
  courseId,
  chapterId,
  disabled,
  isPublished,
}: ChapterActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDeleteChapter = async () => {
    setIsLoading(true);

    try {
      await deleteChapter({ courseId, chapterId });
      toast.success("Chapter deleted successfully");
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant={"outline"} disabled={disabled}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDeleteChapter}>
        <Button variant={"destructive"} size={"sm"} disabled={isLoading}>
          {isLoading ? <Spinner /> : <Trash />}
        </Button>
      </ConfirmModal>
    </div>
  );
}

"use client";
import {
    deleteChapter,
    publishChapter,
    unpublishChapter,
} from "@/actions/chapters";
import { ConfirmModal } from "@/components/modals/confirmModal";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const onClickHandler = async () => {
    setIsLoading(true);

    try {
      if (isPublished) {
        await unpublishChapter({ courseId, chapterId, path });
        toast.success("Chapter unpublished successfully");
      } else {
        await publishChapter({ courseId, chapterId, path });
        toast.success("Chapter published successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteChapter = async () => {
    setIsDeleting(true);

    try {
      await deleteChapter({ courseId, chapterId });
      toast.success("Chapter deleted successfully");
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={"outline"}
        disabled={disabled || isLoading || isDeleting}
        onClick={onClickHandler}
      >
        {isPublished && !isLoading ? "Unpublish" : "Publish"}
        {isLoading && <Spinner />}
      </Button>
      <ConfirmModal onConfirm={onDeleteChapter}>
        <Button
          variant={"destructive"}
          size={"sm"}
          disabled={isDeleting || isLoading}
        >
          {isDeleting ? <Spinner /> : <Trash />}
        </Button>
      </ConfirmModal>
    </div>
  );
}

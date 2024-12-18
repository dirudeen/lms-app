"use client";
import { ConfirmModal } from "@/components/modals/confirmModal";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
  courseId: string;
  disabled: boolean;
  isPublished: boolean;
}

export default function Actions({
  courseId,
  disabled,
  isPublished,
}: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const onClickHandler = async () => {
    setIsLoading(true);

    try {
      // if (isPublished) {
      //   await unpublishCourse({ courseId, path });
      //   toast.success("Chapter unpublished successfully");
      // } else {
      //   await publishCourse({ courseId, path });
      //   toast.success("Chapter published successfully");
      // }
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
      // await deleteCourse({ courseId });
      // toast.success("Chapter deleted successfully");
      // router.push(`/teacher/courses/`);
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

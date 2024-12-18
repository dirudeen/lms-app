"use client";
import { deleteCourse, publishCourse, unPublishCourse } from "@/actions/course";
import { ConfirmModal } from "@/components/modals/confirmModal";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
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
  
  const confetti = useConfettiStore()

  const onClickHandler = async () => {
    setIsLoading(true);

    try {
      if (isPublished) {
        await unPublishCourse({ courseId, path });
        toast.success("Course unpublished successfully");
      } else {
        await publishCourse({ courseId, path });
        toast.success("Course published successfully");
        confetti.onOpen()
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteCourse({ courseId });
      toast.success("Course deleted successfully");
      router.push(`/teacher/courses/`);
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
        {!isLoading ? isPublished ? "Unpublish" : "Publish" : <Spinner />}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
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

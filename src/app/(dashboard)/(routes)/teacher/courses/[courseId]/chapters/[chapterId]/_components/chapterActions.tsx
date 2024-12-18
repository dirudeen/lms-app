"use client"
import { ConfirmModal } from "@/components/modals/confirmModal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ChapterActionsProps {
  courseId: string;
  chapterId: string;
  disabled: boolean;
  isPublished: boolean;
}

export default function ChapterActions({courseId, chapterId, disabled, isPublished}: ChapterActionsProps) {
  return (
    <div className="flex items-center gap-2">
        <Button variant={'outline'} disabled={disabled}>
            {isPublished ? 'Unpublish' : "Publish"} 
        </Button>
        <ConfirmModal onConfirm={() => {}}>
        <Button variant={'destructive'} size={"sm"}>
            <Trash />
        </Button>
        </ConfirmModal>
    </div>
  )
}

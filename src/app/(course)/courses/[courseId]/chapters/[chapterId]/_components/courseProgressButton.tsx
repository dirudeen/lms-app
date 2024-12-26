"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

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

return <Button
    type="button"
    variant={isCompleted ? "outline" : "success"}
    >
    {isCompleted ? "Not Completed" : "Mark as Complete"}
    <Icon className="size-4 ml-2" />
  </Button>;
}

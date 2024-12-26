"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Video } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateChapter } from "@/actions/chapters";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Chapter, chapterInsertSchema, MuxData } from "@/types";
import { PencilIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import FormCard from "../../../_components/FormCard";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData: {
    videoUrl: Chapter["videoUrl"];
    muxData: MuxData | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = chapterInsertSchema.pick({ videoUrl: true });

export function ChapterVideoForm({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { videoUrl: initialData.videoUrl || "" },
  });
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateChapter({ courseId, path: pathname, values, chapterId });
      toast.success("Chapter video updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <FormCard>
      <div className="flex items-center justify-between font-medium">
        <p>Chapter video</p>
        <Button
          variant={"ghost"}
          onClick={() => setIsEditing((prevState) => !prevState)}
        >
          {isEditing && "Cancel"}

          {!isEditing && !initialData.videoUrl && (
            <Fragment>
              <PlusCircle className="size-4 mr-2" />
              Add a video
            </Fragment>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <PencilIcon className="size-4 mr-3" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing && !initialData.videoUrl && (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <Video className="size-10 text-slate-500" />
        </div>
      )}
      {!isEditing && initialData.videoUrl && initialData.muxData && (
        <div className="relative aspect-video mt-2">
          <MuxPlayer playbackId={initialData.muxData.playbackId || ""} />
        </div>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseVideo"
            onchange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <p className="text-sm text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </p>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-sm text-muted-foreground mt-4">
          Videos can take a few minutes to process, Refresh the page if video
          does not appear.
        </div>
      )}
    </FormCard>
  );
}

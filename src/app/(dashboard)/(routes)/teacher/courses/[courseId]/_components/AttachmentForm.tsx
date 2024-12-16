"use client";

import { File, Loader2, PlusCircle, Trash } from "lucide-react";
import { z } from "zod";

import { createAttachment, deleteAttachment } from "@/actions/attachment";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Attachment, Course } from "@/types";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import FormCard from "./FormCard";

interface AttachmentFormProps {
  initialData: { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1),
});

export function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("it's here now");
    try {
      await createAttachment({ courseId, path: pathname, values });
      setIsEditing(false);
      toast.success("Course attachment updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleDelete = async (id: string, url: string) => {
    setIsDeleting(id);
    try {
      await deleteAttachment({
        attachmentId: id,
        courseId,
        path: pathname,
        url,
      });

      toast.success("Attachment deleted");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <FormCard>
      <div className="flex items-center justify-between font-medium">
        <p>Course attachments</p>
        <Button
          variant={"ghost"}
          onClick={() => setIsEditing((prevState) => !prevState)}
        >
          {isEditing && "Cancel"}

          {!isEditing && (
            <Fragment>
              <PlusCircle className="size-4 mr-2" />
              Add a file
            </Fragment>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-1.5">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex justify-between items-center p-2 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md"
                >
                  <div className="gap-x-2 flex items-center">
                    <File className="size-4 flex-shrink-0" />
                    <p className="truncate max-w-72">{attachment.name}</p>
                  </div>
                  <Button
                    size={"sm"}
                    variant={"destructive"}
                    onClick={() => handleDelete(attachment.id, attachment.url)}
                    disabled={isDeleting === attachment.id}
                  >
                    {isDeleting === attachment.id && (
                      <Loader2 className="ml-auto size-4 animate-spin" />
                    )}
                    {isDeleting !== attachment.id && (
                      <Trash className="size-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachments"
            onchange={(url, name) => {
              if (url && name) {
                onSubmit({ url: url, name: name });
              }
            }}
          />
          <p className="text-sm text-muted-foreground mt-4">
            Add anything your students might need to complete the course
          </p>
        </div>
      )}
    </FormCard>
  );
}

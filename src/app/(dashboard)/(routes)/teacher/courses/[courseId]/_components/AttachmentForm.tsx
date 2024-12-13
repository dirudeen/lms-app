"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { File, ImageIcon, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateCourse } from "@/actions/course";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Course,
  imageUrlInputValidation
} from "@/types";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import FormCard from "./FormCard";
import { Attachment } from "@/types";
import { createAttachment } from "@/actions/attachment";

interface AttachmentFormProps {
  initialData: {
    course: Course,
    attachments: Attachment[]
  };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1)
})

export function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {

  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("it's here now")
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
        {initialData.attachments.length === 0 && <p className="text-sm mt-2 text-slate-500 italic">No attachments yet</p>}
        {initialData.attachments.length > 0 &&
        <div>
          {initialData.attachments.map((attachment) => (
            <div key={attachment.id} className="flex justify-center items-center h-40 rounded-md bg-slate-200 mt-2">
              <File />
              <p className="text-sm text-muted-foreground mt-4">{attachment.name}</p>
            </div>
          ))}
        </div>} 
       </>   
      )}

      {isEditing && (
        <div>
          <FileUpload
          endpoint="courseAttachments"
          onchange={(url, name) => {
            if(url && name){
              onSubmit({url: url, name: name})
            }
          }}
          />
          <p className="text-sm text-muted-foreground mt-4">Add anything your students might need to complete the course</p>
        </div>
        )} 
    </FormCard>
  );
}

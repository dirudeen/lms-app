"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageIcon, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import {
  Course,
  descriptionInputValidation,
  imageUrlInputValidation,
} from "@/types";
import { PencilIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { updateCourse } from "@/actions/course";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/Spinner";
import Image from "next/image";
import { FileUpload } from "@/components/FileUpload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

export function ImageForm({ initialData, courseId }: ImageFormProps) {
  const form = useForm({
    resolver: zodResolver(imageUrlInputValidation),
    defaultValues: { imageUrl: initialData.imageUrl || ""},
  });
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof imageUrlInputValidation>) => {
    try {
      await updateCourse({ courseId, path: pathname, values });
      setIsEditing(false);
      toast.success("Course image updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="bg-slate-100 p-4 mt-6 rounded-md border">
      <div className="flex items-center justify-between font-medium">
        <p>Course Image</p>
        <Button
          variant={"ghost"}
          onClick={() => setIsEditing((prevState) => !prevState)}
        >
          {isEditing && "Cancel"}

          {!isEditing && !initialData.imageUrl && (
            <Fragment>
              <PlusCircle className="size-4 mr-2" />
              Add Image
            </Fragment>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <PencilIcon className="size-4 mr-3" />
              Edit Image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
        <div className="flex justify-center items-center h-40 rounded-md bg-slate-200 mt-2">
          <ImageIcon className="size-10 text-slate-500" />
        </div>
      ) : (
        <div className="relative aspect-video mt-2">
          <Image
            alt="upload"
            src={initialData.imageUrl!}
            className="object-cover rounded-md"
            fill
          />
        </div>
      ))}

      {isEditing && (
        <div>
          <FileUpload
          endpoint="courseImage"
          onchange={(url) => {
            if(url){
              onSubmit({imageUrl: url})
            }
          }}
          />
          <p className="text-sm text-muted-foreground mt-4">16:9 aspect ratio recommeded</p>
        </div>
        )} 
    </div>
  );
}

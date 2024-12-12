"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, PlusCircle } from "lucide-react";
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

interface ImageFormProps {
  initialData: {
    imageUrl: Course["imageUrl"]
  };
  courseId: string;
}

export function ImageForm({ initialData, courseId }: ImageFormProps) {
  const form = useForm({
    resolver: zodResolver(imageUrlInputValidation),
    defaultValues: { imageUrl: initialData.imageUrl || ""},
  });
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);


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
    <FormCard>
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
    </FormCard>
  );
}

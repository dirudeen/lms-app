"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateCourse } from "@/actions/course";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Course, titleInputValidation } from "@/types";
import { PencilIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import FormCard from "./FormCard";

interface TitleFormProps {
  initialData: {
    title: Course["title"]
  };
  courseId: string;
}

export function TitleForm({ initialData, courseId }: TitleFormProps) {
  const form = useForm({
    resolver: zodResolver(titleInputValidation),
    defaultValues: initialData,
  });
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof titleInputValidation>) => {
    try {
      await updateCourse({courseId, path: pathname, values})
       setIsEditing(false)
      toast.success("Course title updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <FormCard>
      <div className="flex items-center justify-between font-medium">
        <p>Course title</p>
        <Button 
        variant={"ghost"}
        onClick={() => setIsEditing(prevState => !prevState)}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PencilIcon className="size-4 mr-3" />
              Edit title
            </>
          )}
        </Button>
      </div>
        {!isEditing && <p className="text-sm">{initialData.title}</p>}
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="e.g 'Advance Web Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="ml-auto"
              >
                {isSubmitting ? (<Spinner className="text-white" size={"small"}/>) : "save"}
              </Button>
            </form>
          </Form>
        )}
    </FormCard>
  );
}

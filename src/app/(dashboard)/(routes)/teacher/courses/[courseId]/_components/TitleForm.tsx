"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { titleInputValidation } from "@/types";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { updateCourse } from "@/actions/course";
import { Spinner } from "@/components/Spinner";

interface TitleFormProps {
  initialData: {
    title: string;
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
    <div className="bg-slate-100 p-4 mt-6 rounded-md border">
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
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";

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
import { descriptionInputValidation } from "@/types";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { updateCourse } from "@/actions/course";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/Spinner";

interface DescriptionFormProps {
  initialData: {
    description: string | undefined;
  };
  courseId: string;
}
// const descriptionInputValidation = z.object({
//   description: z.string().nullable()
// })

export function DescriptionForm({ initialData, courseId }: DescriptionFormProps) {
  const form = useForm({
    resolver: zodResolver(descriptionInputValidation),
    defaultValues: initialData,
  });
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);

  const { isSubmitting, isValid } = form.formState;


  const onSubmit = async (values: z.infer<typeof descriptionInputValidation>) => {
    try {
      await updateCourse({courseId, path: pathname, values})
       setIsEditing(false)
      toast.success("Course description updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <div className="bg-slate-100 p-4 mt-6 rounded-md border">
      <div className="flex items-center justify-between font-medium">
        <p>Course description</p>
        <Button 
        variant={"ghost"}
        onClick={() => setIsEditing(prevState => !prevState)}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PencilIcon className="size-4 mr-3" />
              Edit
            </>
          )}
        </Button>
      </div>
        {!isEditing && (
          <p className={cn("text-sm mt-2", !initialData.description && "text-slate-700 italic")}>{initialData.description || "No description yet"}</p>
          )}
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="e.g. This course is about..." {...field} />
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

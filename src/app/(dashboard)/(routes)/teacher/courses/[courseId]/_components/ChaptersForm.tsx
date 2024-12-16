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
import {
  chapterInsertSchema,
  Chapters,
  descriptionInputValidation,
} from "@/types";
import { PencilIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { updateCourse } from "@/actions/course";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/Spinner";
import FormCard from "./FormCard";
import { Input } from "@/components/ui/input";
import { createChapter } from "@/actions/chapters";

interface ChaptersFormProps {
  initialData: {
    chapters: Chapters[];
  };
  courseId: string;
}

const formSchema = chapterInsertSchema.pick({ title: true });

export function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createChapter({courseId, path: pathname, values})
      setIsCreating((prev) => !prev);
      toast.success("Course chpater created");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <FormCard>
      <div className="flex items-center justify-between font-medium">
        <p>Course chapers</p>
        <Button
          variant={"ghost"}
          onClick={() => setIsCreating((prevState) => !prevState)}
        >
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircleIcon className="size-4 mr-3" />
              Add a chaper
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. This course is about..."
                      {...field}
                    />
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
              {isSubmitting ? (
                <Spinner className="text-white" size={"small"} />
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div>
          {!initialData.chapters.length && (
            <p
              className={cn(
                "text-md mt-2",
                !initialData.chapters.length && "text-slate-500 italic"
              )}
            >
              No chapers
            </p>
          )}
        </div>
      )}
      {!isCreating && (
        <p className="text-sm text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </FormCard>
  );
}

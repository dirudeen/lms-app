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
  Chapter,
  descriptionInputValidation,
} from "@/types";
import { Loader2, Loader2Icon, PencilIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { updateCourse } from "@/actions/course";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/Spinner";
import FormCard from "./FormCard";
import { Input } from "@/components/ui/input";
import { createChapter, updateChaptersOrder } from "@/actions/chapters";
import ChaptersList from "./ChaptersList";

interface ChaptersFormProps {
  initialData: {
    chapters: Chapter[];
  };
  courseId: string;
}

const formSchema = chapterInsertSchema.pick({ title: true });

export function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createChapter({ courseId, path: pathname, values });
      setIsCreating((prev) => !prev);
      toast.success("Course chpater created");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const onReoder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await updateChaptersOrder({
        items: updateData,
        courseId
      });
      toast.success("Chapters reordered");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`teacher/courses/${courseId}/chapters/${id}`);
  }

  return (
    <FormCard className="relative">
      {isUpdating && (
        <div className="absolute size-full top-0 right-0 flex justify-center items-center bg-slate-500/20 rounded-md">
          <Loader2Icon className="size-6 text-sky-700 animate-spin" />
        </div>
      )}
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
                      placeholder="Chapter Title, e.g. Introduction"
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
          {initialData.chapters.length > 0 && (
            <ChaptersList
              onReoder={onReoder}
              onEdit={onEdit}
              items={initialData.chapters}
            />
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

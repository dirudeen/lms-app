"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateChapter } from "@/actions/chapters";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { chapterInsertSchema, Course } from "@/types";
import { PencilIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import FormCard from "../../../_components/FormCard";

interface ChapterTitleFormProps {
  initialData: {
    title: Course["title"];
  };
  courseId: string;
  chapterId: string;
}

const formSchema = chapterInsertSchema.pick({ title: true });

export function ChapterTitleForm({
  initialData,
  courseId,
  chapterId,
}: ChapterTitleFormProps) {
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateChapter({ chapterId, courseId, path: pathname, values });
      toast.success("Chapter title updated");
      form.reset({ title: values.title });
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
        <p>Chapter title</p>
        <Button
          variant={"ghost"}
          onClick={() => setIsEditing((prevState) => !prevState)}
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
                    <Input
                      placeholder="e.g Introduction to the course"
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
                "Save"
              )}
            </Button>
          </form>
        </Form>
      )}
    </FormCard>
  );
}

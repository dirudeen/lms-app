"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { chapterInsertSchema } from "@/types";
import { PencilIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import FormCard from "../../../_components/FormCard";
import Editor from "@/components/editor";
import Preview from "@/components/preview";

interface ChapterDescriptionFormProps {
  initialData: {
    description: string | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = chapterInsertSchema.pick({ description: true });

export function ChapterDescriptionForm({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) {
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description ? initialData.description : "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateChapter({ courseId, chapterId, path: pathname, values });
      toast.success("Chapter description updated");
      form.reset({ description: values.description || "" });
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
        <p>Chapter description</p>
        <Button
          variant={"ghost"}
          onClick={() => setIsEditing((prevState) => !prevState)}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PencilIcon className="size-4 mr-3" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-700 italic"
          )}
        >
          {!initialData.description && <p>No chapter description yet</p>}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
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
                    <Editor value={field.value} onChange={field.onChange} />
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

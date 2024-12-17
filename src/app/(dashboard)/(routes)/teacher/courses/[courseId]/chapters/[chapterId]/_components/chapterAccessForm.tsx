"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateChapter } from "@/actions/chapters";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { chapterInsertSchema } from "@/types";
import { PencilIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import FormCard from "../../../_components/FormCard";

interface ChapterAccessFormProps {
  initialData: {
    isFree: boolean;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = chapterInsertSchema.pick({ isFree: true });

export function ChapterAccessForm({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) {
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateChapter({ courseId, chapterId, path: pathname, values });
      toast.success("Chapter access updated");
      form.reset({ isFree: values.isFree });
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
        <p>Chapter access</p>
        <Button
          variant={"ghost"}
          onClick={() => setIsEditing((prevState) => !prevState)}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PencilIcon className="size-4 mr-3" />
              Edit access
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && "text-slate-700 italic"
          )}
        >
          {!initialData.isFree && <>This course is not free for preview</>}
          {initialData.isFree && <>This course is free for preview</>}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row space-y-0 space-x-3 border rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormDescription className="space-y-1 leading-none">
                    Check this box if you want to make this chpater free for
                    preview
                  </FormDescription>
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

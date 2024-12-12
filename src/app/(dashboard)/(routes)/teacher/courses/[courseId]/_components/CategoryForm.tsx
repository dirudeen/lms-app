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
import { Course, categoryInputValidation } from "@/types";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { updateCourse } from "@/actions/course";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/Spinner";
import FormCard from "./FormCard";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: {
    categoryId: Course["categoryId"];
  };
  courseId: string;
  options: Array<{label: string, value: string}>
}


export function CategoryForm({ initialData, courseId, options }: CategoryFormProps) {
  const form = useForm({
    resolver: zodResolver(categoryInputValidation),
    defaultValues: {categoryId: initialData.categoryId ? initialData.categoryId : ""},
  });
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);

  const { isSubmitting, isValid } = form.formState;


  const onSubmit = async (values: z.infer<typeof categoryInputValidation>) => {
    try {
      await updateCourse({courseId, path: pathname, values})
       setIsEditing(false)
      toast.success("Course category updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const selectedOption = options.find(option => option.value === initialData.categoryId)

  return (
    <FormCard>
      <div className="flex items-center justify-between font-medium">
        <p>Course category</p>
        <Button 
        variant={"ghost"}
        onClick={() => setIsEditing(prevState => !prevState)}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PencilIcon className="size-4 mr-3" />
              Edit category
            </>
          )}
        </Button>
      </div>
        {!isEditing && (
          <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-700 italic")}>{selectedOption?.label || "No category yet"}</p>
          )}
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox 
                        options={options}
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
                {isSubmitting ? (<Spinner className="text-white" size={"small"}/>) : "save"}
              </Button>
            </form>
          </Form>
        )}
    </FormCard>
  );
}

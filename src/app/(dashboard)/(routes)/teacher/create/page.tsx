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
import Link from "next/link";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createCourse } from "@/actions/course";
import { useRouter } from "next/navigation";
import { titleInputValidation } from "@/types";

export default function CreatePage() {
    const router = useRouter()

  const form = useForm({
    resolver: zodResolver(titleInputValidation),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof titleInputValidation>) => {
    // await new Promise(resolve => setTimeout(resolve, 4000))
    try {
        const data = await createCourse(values)
        toast.success("Course created")
        router.push("/teacher/courses/" + data.id)
    } catch (error) {
        if(error instanceof Error){
            toast.error(error.message)
        }
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex h-full p-6 sm:justify-center sm:items-center">
      <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold">Name your course</h1>
            <p className="text-sm text-slate-600">
              What would you like to name your course. Don&apos;t worry, you change
              it later.
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'Advance Web Development"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What will you teach in this course?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-x-4">
                <Button asChild variant="ghost" type="button">
                  <Link href="/">Cancel</Link>
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Please wait</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
      </div>
    </div>
  );
}

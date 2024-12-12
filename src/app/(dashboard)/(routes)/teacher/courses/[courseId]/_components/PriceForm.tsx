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
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Course, priceInputValidation } from "@/types";
import { PencilIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import FormCard from "./FormCard";

interface PriceFormProps {
  initialData: {
    price: Course["price"];
  };
  courseId: string;
}


export function PriceForm({ initialData, courseId }: PriceFormProps) {
  const form = useForm({
    resolver: zodResolver(priceInputValidation),
    defaultValues: {price: initialData.price ? initialData.price : undefined},
  });
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);

  const { isSubmitting, isValid } = form.formState;


  const onSubmit = async (values: z.infer<typeof priceInputValidation>) => {
    try {
      await updateCourse({courseId, path: pathname, values})
       setIsEditing(false)
      toast.success("Course price updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };


  return (
    <FormCard>
      <div className="flex items-center justify-between font-medium">
        <p>Course price</p>
        <Button 
        variant={"ghost"}
        onClick={() => setIsEditing(prevState => !prevState)}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PencilIcon className="size-4 mr-3" />
              Edit price
            </>
          )}
        </Button>
      </div>
        {!isEditing && (
          <p className={cn("text-sm mt-2", !initialData.price && "text-slate-700 italic")}>{initialData.price ? formatPrice(parseFloat(initialData.price)) : "No price yet"}</p>
          )}
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                    <Input
                    type="number"
                    pattern="[0-9].*"
                    placeholder="your price"
                    step={0.01}
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

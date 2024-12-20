import { Category, Course } from "@/types";
import React from "react";
import CourseItem from "./courseItem";

type CourseWithProgressAndCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressAndCategory[];
}
export default function CoursesList({ items }: CoursesListProps) {
  return (
    <div>
      {items.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mt-8">
          {items.map((item) => (
            <CourseItem
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price!}
              imageUrl={item.imageUrl!}
              progress={item.progress}
              chaptersLength={item.chapters.length}
              category={item.category?.name!}
            />
          ))}
        </div>
      )}
      {items.length === 0 && (
        <p className="text-sm text-center text-muted-foreground mt-10">
          No course found
        </p>
      )}
    </div>
  );
}

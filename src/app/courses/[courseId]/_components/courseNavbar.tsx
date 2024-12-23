import NavbarRoutes from "@/components/navbarRoutes";
import { Chapter, Course, UserProgress } from "@/types";
import React from "react";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export default function CourseNavbar({ course, progressCount }: CourseNavbarProps) {
  return <header className="p-4 border-b h-full flex items-center bg-white shadow-sm">
    <NavbarRoutes />
  </header>;
}

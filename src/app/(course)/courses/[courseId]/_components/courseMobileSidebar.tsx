import { Chapter, Course, UserProgress } from "@/types";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import CourseSidebar from "./courseSidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
export default function CourseMobileSidebar({
  course,
  progressCount,
}: CourseMobileSidebarProps) {
  return (
    <Sheet>
  <SheetTrigger className="md:hidden pr-4 hover:opacity-75 cursor-pointer">
    <Menu />
  </SheetTrigger>
  <SheetContent side={"left"} className="p-0 bg-white w-72">
    <CourseSidebar course={course} progressCount={progressCount} />
  </SheetContent>
</Sheet>
  );
}

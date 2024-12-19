import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/column";
import { fetchAllCourses } from "@/actions/course";

export default async function CoursesPage() {
  const courses = await fetchAllCourses();
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
}

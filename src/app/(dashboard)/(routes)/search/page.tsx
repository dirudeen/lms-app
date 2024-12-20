import {
  fetchCategories,
  getCoursesWithProgressAndCategory,
} from "@/actions/course";
import Categories from "./_components/categories";
import SearchInput from "@/components/seaerchInput";
import CoursesList from "@/components/coursesList";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const categories = await fetchCategories();
  const courses = await getCoursesWithProgressAndCategory(searchParams);

  return (
    <>
      <div className="px-6 pt-6 block md:hidden">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

import { fetchCategories } from "@/actions/course";
import Categories from "./_components/categories";

export default async function SearchPage() {
  const categories = await fetchCategories();
  return (
    <div className="p-6">
      <Categories items={categories} />
    </div>
  );
}

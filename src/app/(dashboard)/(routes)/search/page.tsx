import { fetchCategories } from "@/actions/course";
import Categories from "./_components/categories";
import SearchInput from "@/components/seaerchInput";

export default async function SearchPage() {
  const categories = await fetchCategories();
  return (
    <>
    <div className="px-6 pt-6 block md:hidden">
    <SearchInput />
    </div>
    <div className="p-6">
      <Categories items={categories} />
    </div>
    </>
  );
}

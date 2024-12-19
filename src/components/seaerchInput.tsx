"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import useDebouce from "@/hooks/useDebouce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string"

export default function SearchInput() {
    const [value, setValue] = useState('')
    const debouncedValue = useDebouce({ value, delay: 500 });

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentCategoryId = searchParams.get('categoryId');

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue 
            }
        }, { skipEmptyString: true, skipNull: true })
        router.push(url)
    }, [debouncedValue, currentCategoryId, pathname, router])
  
    return (
    <div className="relative">
      <Search className="size-4 absolute top-3 left-3" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Seach for a courses"
        className="pl-9 w-full md:w-[300px] rounded-full bg-slate-100 focus-within:ring-slate-200"
      />
    </div>
  );
}

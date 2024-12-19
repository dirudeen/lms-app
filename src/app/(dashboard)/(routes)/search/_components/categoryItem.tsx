"use client";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import qs from "query-string";

interface CategoryItemProps {
  label: string;
  icon: IconType;
  value: string;
}

export default function CategoryItem({
  label,
  icon: Icon,
  value,
}: CategoryItemProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentTitleInUrl = searchParams.get("title");
  const currentCategoryIdInUrl = searchParams.get("categoryId");
  const isSelected = currentCategoryIdInUrl === value;
  const clickHandler = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitleInUrl,
          categoryId: isSelected ? null : value,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <button
      onClick={clickHandler}
      className={cn(
        "py-2 px-3 border border-slate-200 flex items-center gap-1 text-sm rounded-full hover:border-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <span className="truncate">{label}</span>
    </button>
  );
}

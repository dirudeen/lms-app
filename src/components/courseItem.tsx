import { BookOpen } from "lucide-react";
import Image from "next/image";
import React from "react";
import { IconBadge } from "./IconBadge";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

interface CourseItemProps {
  title: string;
  price: string;
  imageUrl: string;
  progress: number | null;
  chaptersLength: number;
  category: string;
  id: string;
}

export default function CourseItem({
  title,
  price,
  imageUrl,
  progress,
  chaptersLength,
  category,
  id,
}: CourseItemProps) {
  return (
    <Link href={`/course/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full hover:scale-105">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-sm text-muted-foreground">{category}</p>
          <div className="flex my-3 items-center gap-2 text-sm md:text-xs">
            <div className="flex items-center gap-1 text-slate-500">
              <IconBadge icon={BookOpen} size={"sm"} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div>TODO: Progress component</div>
          ) : (
            <p>{formatPrice(parseFloat(price || "0"))}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

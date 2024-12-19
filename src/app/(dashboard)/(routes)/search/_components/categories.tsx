"use client";

import { Category } from "@/types";
import { IconType } from "react-icons";
import {
  FcMultipleDevices,
  FcMusic,
  FcSportsMode,
  FcCamera,
  FcPrivacy,
  FcMoneyTransfer,
  FcEngineering,
  FcFilmReel,
} from "react-icons/fc";
import CategoryItem from "./categoryItem";
interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Computer Science": FcMultipleDevices,
  Fitness: FcSportsMode,
  Music: FcMusic,
  Photography: FcCamera,
  "Cyber Security": FcPrivacy,
  Accounting: FcMoneyTransfer,
  Engineering: FcEngineering,
  Filming: FcFilmReel,
};

export default function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
}

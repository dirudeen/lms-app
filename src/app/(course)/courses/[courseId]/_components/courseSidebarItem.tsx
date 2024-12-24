"use client"

import { cn } from "@/lib/utils";
import { CheckCircle, LockIcon, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
    id: string;
    label: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
}

export default function CourseSidebarItem({courseId, id, label, isCompleted, isLocked}: CourseSidebarItemProps) {
 const router = useRouter();
 const pathname = usePathname();

 const Icon = isLocked ? LockIcon : isCompleted ? CheckCircle : PlayCircle
 const isActive = pathname.includes(id)

 const handleClick = () => {
     router.push(`/courses/${courseId}/chapters/${id}`)
 }

    return (
    <button 
    className={cn(
        "flex items-center gap-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && "text-emerald-700 hober:text-emerald-700",
        isActive && isCompleted && "bg-emerald-200/20"
    )}
    type="button"
    onClick={handleClick}
    >
    <div className="flex items-center gap-2 py-4">
        <Icon className={cn(
            "text-slate-500",
            isCompleted && "text-emerald-700",
            isActive && "text-slate-700" 
        )
        } />
        {label}
    </div>
    <div className={cn(
        "ml-auto opacity-0 border-slate-700 h-full transition-all border",
        isActive && "opacity-100",
        isCompleted && "border-emerald-700"
    )}
        />
        
        </button>
  )
}

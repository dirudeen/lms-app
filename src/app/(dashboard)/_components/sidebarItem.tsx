"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface SidebarItemProp {
    icon: LucideIcon,
    path: string,
    label: string,
}

export default function SidebarItem({icon: Icon, path, label }: SidebarItemProp) {

    const pathname = usePathname()

    const isActive = (pathname === "/" && path === "/") || pathname === path || pathname.startsWith(`${path}/`)

  return (
    <Link href={path} className={cn("flex items-center gap-x-2 text-slate-500 text-sm font-medium transition-all pl-6 hover:text-slate-600 hover:bg-slate-300/20", 
        isActive && "text-sky-700 bg-slate-200/20 hover:text-sky-700 hover:bg-slate-200/20 h-full"
    )}>
        <div className="flex gap-x-2 items-center py-4">
            <Icon />
            <p>{label}</p>
        </div>
        <div 
            className={cn("h-full ml-auto border-2 border-sky-700  opacity-0 transition-all", isActive && "opacity-100")}
        />
    </Link>
  )
}

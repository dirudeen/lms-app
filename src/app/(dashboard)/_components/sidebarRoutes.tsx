"use client"
import { Compass, Layout, BarChart, List } from "lucide-react"
import SidebarItem from "./sidebarItem"
import { usePathname } from "next/navigation"

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        path: "/"
    },
    {
        icon: Compass,
        label: "Browse",
        path: "/search"
    }
]
const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        path: "/teacher/courses"
    },
    {
        icon: BarChart,
        label: "Analytics",
        path: "/teacher/analytics"
    }
]

export default function SidebarRoutes() {
    // differentiate between teacher and guest routes
    const pathname = usePathname()
    const routes = pathname.includes("/teacher") ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">{
        routes.map(route => {
            return (
                <SidebarItem
                    key={route.path}
                    path={route.path}
                    icon={route.icon}
                   label={route.label}
                
                />
            )
        })
    }</div>
  )
}

"use client"
import { Compass, Layout } from "lucide-react"
import SidebarItem from "./sidebarItem"

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

export default function SidebarRoutes() {
    // differentiate between teacher and guest routes
    const routes = guestRoutes
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

import Logo from "./logo";
import SidebarRoutes from "./sidebarRoutes";

export default function Sidebar(){
    return (<aside className="h-full border-r flex flex-col bg-white overflow-y-auto shadow-lg">
        <div className="p-6">
            <Logo />
        </div>
        <div className="flex flex-col w-full">
            <SidebarRoutes />
        </div>
    </aside>)
}
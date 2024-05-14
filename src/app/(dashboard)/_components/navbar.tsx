import MobileSidebar from "./mobileSidebar"

export default function Navbar() {
  return (
    <div className="flex items-center p-4 border-b h-full shadow-sm w-full">
        <MobileSidebar />
    </div>
  )
}

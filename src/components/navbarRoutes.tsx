"use client";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function NavbarRoutes() {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname.startsWith("/teacher");
  const isPlayerPage = pathname.includes("/chapter");
  return (
    <div className="flex gap-x-2 ml-auto">
    <Button asChild variant='ghost' size="sm">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/" className="space-x-2"><LogOut className="size-4 mr-2" /> Exit</Link>
      ) : (
          <Link href="/teacher/courses">Teacher mode</Link>
        )}
    </Button>
      <UserButton />
    </div>
  );
}

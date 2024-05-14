import React from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <section className="h-full">
      <div className="md:pl-56 flex items-center fixed h-20 inset-y-0 z-50 w-full">
          <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 mt-20 h-full">{children}</main>
    </section>
  );
}

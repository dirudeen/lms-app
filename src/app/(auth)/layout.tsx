import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Auth | Skwl Journey",
  description: "Expand your knowledge and embark on a journey of lifelong learning.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex justify-center items-center min-h-screen">{children}</main>
}
import { UserButton } from "@clerk/nextjs";


export default function Home() {
  return (
    <main className="p-24">
      <p>Home</p>
      <UserButton />
    </main>
  );
}

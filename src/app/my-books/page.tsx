import type { Metadata } from "next";
import MyBooksList from "@/components/MyBooksList";

export const metadata: Metadata = {
  title: "My Books | BookNook",
  description: "Manage your BookNook book collection.",
};

export default function MyBooksPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <MyBooksList />
    </main>
  );
}
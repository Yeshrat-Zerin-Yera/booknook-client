import type { Metadata } from "next";
import MyBorrowsList from "@/components/MyBorrowsList";

export const metadata: Metadata = {
  title: "My Borrows | BookNook",
  description: "View and manage your borrowed books.",
};

export default function MyBorrowsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <MyBorrowsList />
    </main>
  );
}
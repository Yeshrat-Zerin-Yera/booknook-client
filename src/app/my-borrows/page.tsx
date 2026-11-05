import type { Metadata } from "next";
import MyBorrowsList from "@/components/MyBorrowsList";
import RequireAuth from "@/components/RequireAuth";

export const metadata: Metadata = {
  title: "My Borrows | BookNook",
  description: "View and manage your borrowed books.",
};

export default function MyBorrowsPage() {
  return (
    <RequireAuth>
      <main className="min-h-screen bg-[#faf9f6]">
        <MyBorrowsList />
      </main>
    </RequireAuth>
  );
}
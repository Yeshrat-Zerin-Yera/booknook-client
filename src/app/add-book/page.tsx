import type { Metadata } from "next";
import AddBookForm from "@/components/AddBookForm";

export const metadata: Metadata = {
  title: "Add a Book | BookNook",
  description: "Add a new book to the BookNook library.",
};

export default function AddBookPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <AddBookForm />
    </main>
  );
}

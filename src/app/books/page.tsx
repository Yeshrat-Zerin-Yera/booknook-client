import type { Metadata } from "next";
import BooksExplorer from "@/components/BooksExplorer";

export const metadata: Metadata = {
  title: "All Books | BookNook",
  description: "Explore the BookNook library collection.",
};

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <BooksExplorer />
    </main>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import BooksExplorer from "@/components/BooksExplorer";

export const metadata: Metadata = {
  title: "All Books | BookNook",
  description: "Explore the BookNook library collection.",
};

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <p>Loading books...</p>
          </div>
        }
      >
        <BooksExplorer />
      </Suspense>
    </main>
  );
}

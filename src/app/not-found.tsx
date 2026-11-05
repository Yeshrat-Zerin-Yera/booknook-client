import Link from "next/link";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#faf9f6] px-6 text-center">

      <BookX className="mb-6 h-16 w-16 text-[#174c3c]" />

      <h1 className="text-5xl font-bold text-[#174c3c]">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Book Not Found
      </h2>

      <p className="mt-3 max-w-md text-gray-500">
        Sorry! We couldn't find the book you're looking for.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-xl bg-[#174c3c] px-7 py-3 font-semibold text-white transition hover:bg-[#10382c]"
      >
        Back To Home
      </Link>

    </main>
  );
}

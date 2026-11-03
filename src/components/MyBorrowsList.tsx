import Link from "next/link";
import Image from "next/image";
import { BookOpen, RotateCcw } from "lucide-react";
import { books } from "@/data/book";

export default function MyBorrowsList() {
  // Temporary sample: first two books are borrowed.
  const borrowedBooks = books.slice(0, 2);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#a17b45]">
          Your Reading Journey
        </p>

        <h1 className="text-4xl font-bold text-[#174c3c]">
          My Borrows
        </h1>

        <p className="mt-3 text-gray-600">
          Keep track of the books you have borrowed.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {borrowedBooks.map((book) => (
          <article
            key={book.id}
            className="flex gap-5 rounded-2xl border border-[#e8e3d8] bg-white p-5 shadow-sm"
          >
            <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-lg bg-[#eeeae1]">
              <Image
                src={book.cover}
                alt={book.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <span className="w-fit rounded-full bg-[#e9eee9] px-3 py-1 text-xs font-semibold text-[#174c3c]">
                Borrowed
              </span>

              <h2 className="mt-3 text-lg font-bold text-[#243b32]">
                {book.title}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                By {book.author}
              </p>

              <Link
                href={`/books/${book.id}`}
                className="mt-auto flex items-center gap-2 pt-4 text-sm font-semibold text-[#174c3c] hover:underline"
              >
                <BookOpen size={16} />
                View Book
              </Link>

              <button
                type="button"
                disabled
                title="Return will be enabled when borrowing is connected to the backend"
                className="mt-3 flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-400"
              >
                <RotateCcw size={15} />
                Return Book
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-500">
        These are sample borrowed books. Real borrowing records will come
        from MongoDB later.
      </p>
    </section>
  );
}
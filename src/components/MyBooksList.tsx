import Link from "next/link";
import Image from "next/image";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { books } from "@/data/books";

export default function MyBooksList() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#a17b45]">
          Your Collection
        </p>

        <h1 className="text-4xl font-bold text-[#174c3c]">
          My Books
        </h1>

        <p className="mt-3 text-gray-600">
          Manage the books you have added to BookNook.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8e3d8] bg-white">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex flex-col gap-5 border-b border-[#e8e3d8] p-5 last:border-b-0 sm:flex-row sm:items-center"
          >
            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-[#eeeae1]">
              <Image
                src={book.cover}
                alt={book.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-[#243b32]">
                {book.title}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                By {book.author}
              </p>

              <span className="mt-3 inline-block rounded-full bg-[#e9eee9] px-3 py-1 text-xs font-semibold text-[#174c3c]">
                {book.category}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/books/${book.id}`}
                className="flex items-center gap-2 rounded-lg border border-[#174c3c] px-4 py-2 text-sm font-semibold text-[#174c3c] transition hover:bg-[#e9eee9]"
              >
                <BookOpen size={16} />
                View
              </Link>

              <button
                type="button"
                disabled
                title="Edit will be enabled when we connect the backend"
                className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-400"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                type="button"
                disabled
                title="Delete will be enabled when we connect the backend"
                className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-400"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-gray-500">
        Showing {books.length} sample books. Editing and deleting will be
        enabled after backend integration.
      </p>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import { Book } from "@/types/book";

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books`
        );

        if (!response.ok) {
          throw new Error("Failed to load new arrivals");
        }

        const result = await response.json();

        setBooks(result.data.slice(0, 6));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  return (
    <section className="bg-[#faf9f6] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#a17c45]">
              Fresh From Our Shelves
            </p>

            <h2 className="text-3xl font-bold text-[#174c3c] sm:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-3 max-w-xl text-gray-600">
              Discover the latest additions to our growing collection.
              Your next favorite book might be here.
            </p>
          </div>

          <Link
            href="/books"
            className="font-semibold text-[#174c3c] transition hover:text-[#a17c45]"
          >
            Explore All Books →
          </Link>
        </div>

        {loading && (
          <p className="py-12 text-center text-gray-500">
            Loading new arrivals...
          </p>
        )}

        {error && (
          <p className="py-12 text-center text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          books.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-gray-500">
              No books available yet.
            </p>
          )
        )}
      </div>
    </section>
  );
}

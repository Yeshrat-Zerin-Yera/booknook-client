"use client";

import { useEffect, useMemo, useState } from "react";
import BookCard from "./BookCard";
import { Book } from "@/types/book";

export default function BooksExplorer() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const result = await response.json();
        setBooks(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(books.map((book) => book.category))),
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  if (loading) {
    return <p className="py-20 text-center">Loading books...</p>;
  }

  if (error) {
    return <p className="py-20 text-center text-red-600">{error}</p>;
  }

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#9b7653]">
          Explore Our Collection
        </p>

        <h1 className="mb-4 text-4xl font-bold text-[#174c3c]">
          All Books
        </h1>

        <p className="text-gray-500">
          Discover your next favorite book.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-gray-200 px-5 py-3 outline-none focus:border-[#174c3c]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-gray-200 px-5 py-3 outline-none"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-gray-500">
          No books found.
        </p>
      )}
    </section>
  );
}
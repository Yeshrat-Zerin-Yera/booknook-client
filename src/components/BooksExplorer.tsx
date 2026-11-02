"use client";

import { useMemo, useState } from "react";
import BookCard from "@/components/BookCard";
import { books } from "@/data/books";

export default function BooksExplorer() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

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
  }, [search, category]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#a17c45]">
          Find Your Next Read
        </p>

        <h1 className="text-4xl font-bold text-[#174c3c]">
          Explore All Books
        </h1>

        <p className="mt-3 text-gray-600">
          Browse our collection and discover your next favorite story.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search by book title or author..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-[#e8e3d8] bg-white px-5 py-3 outline-none focus:border-[#174c3c]"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-[#e8e3d8] bg-white px-5 py-3 outline-none focus:border-[#174c3c]"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        Showing {filteredBooks.length} books
      </p>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-[#174c3c]">
            No books found
          </h2>
          <p className="mt-2 text-gray-500">
            Try another search term or category.
          </p>
        </div>
      )}
    </section>
  );
}

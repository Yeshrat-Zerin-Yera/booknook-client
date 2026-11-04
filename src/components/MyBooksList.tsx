
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { Book } from "@/types/book";
import { authClient } from "@/lib/auth-client";

export default function MyBooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch only the logged-in user's books
  useEffect(() => {
    async function fetchBooks() {
      try {
        // Get JWT from Better Auth
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please log in to view your books.");
        }

        // Request user's books from backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books/my-books`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch your books."
          );
        }

        setBooks(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  // Delete a book
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      // Get JWT from Better Auth
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please log in before deleting a book.");
      }

      // Send authenticated DELETE request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete book."
        );
      }

      // Remove deleted book from UI
      setBooks((previousBooks) =>
        previousBooks.filter((book) => book._id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Update a book
  async function handleUpdate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingBook) return;

    try {
      setSaving(true);
      setError("");

      // Get JWT from Better Auth
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please log in before editing a book.");
      }

      // Send authenticated PATCH request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${editingBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            title: editingBook.title,
            author: editingBook.author,
            category: editingBook.category,
            cover: editingBook.cover,
            description: editingBook.description,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update book."
        );
      }

      // Update book in UI
      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book._id === editingBook._id
            ? editingBook
            : book
        )
      );

      setEditingBook(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <p className="py-20 text-center">
        Loading your books...
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {/* Page Heading */}
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

      {/* Error Message */}
      {error && (
        <p
          role="alert"
          className="mb-6 rounded-lg bg-red-50 p-4 text-red-700"
        >
          {error}
        </p>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setEditingBook(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-gray-200"
              aria-label="Close edit form"
            >
              &times;
            </button>

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#a17b45]">
              Manage Your Collection
            </p>

            <h2 className="mb-6 text-2xl font-bold text-[#174c3c]">
              Edit Book
            </h2>

            <form
              onSubmit={handleUpdate}
              className="space-y-4"
            >
              {/* Book Title */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Book Title
                </label>

                <input
                  value={editingBook.title}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      title: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#174c3c] focus:ring-2 focus:ring-[#174c3c]/20"
                />
              </div>

              {/* Author */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Author
                </label>

                <input
                  value={editingBook.author}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      author: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#174c3c] focus:ring-2 focus:ring-[#174c3c]/20"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <input
                  value={editingBook.category}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      category: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#174c3c] focus:ring-2 focus:ring-[#174c3c]/20"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Cover Image URL
                </label>

                <input
                  type="url"
                  value={editingBook.cover}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      cover: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#174c3c] focus:ring-2 focus:ring-[#174c3c]/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  value={editingBook.description}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      description: e.target.value,
                    })
                  }
                  required
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#174c3c] focus:ring-2 focus:ring-[#174c3c]/20"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#174c3c] px-6 py-3 font-semibold text-white transition hover:bg-[#123b2f] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Books List */}
      <div className="overflow-hidden rounded-2xl border border-[#e8e3d8] bg-white">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="flex flex-col gap-5 border-b border-[#e8e3d8] p-5 last:border-b-0 sm:flex-row sm:items-center"
            >
              {/* Book Cover */}
              <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-[#eeeae1]">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Book Information */}
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

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/books/${book._id}`}
                  className="flex items-center gap-2 rounded-lg border border-[#174c3c] px-4 py-2 text-sm font-semibold text-[#174c3c] transition hover:bg-[#e9eee9]"
                >
                  <BookOpen size={16} />
                  View
                </Link>

                <button
                  type="button"
                  onClick={() => setEditingBook(book)}
                  className="flex items-center gap-2 rounded-lg bg-[#e9eee9] px-4 py-2 text-sm font-semibold text-[#174c3c] transition hover:bg-[#dce6dc]"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(book._id)}
                  disabled={deletingId === book._id}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {deletingId === book._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-12 text-center text-gray-500">
            No books found. Add your first book!
          </p>
        )}
      </div>

      {/* Book Count */}
      <p className="mt-5 text-sm text-gray-500">
        Showing {books.length} books.
      </p>
    </section>
  );
}

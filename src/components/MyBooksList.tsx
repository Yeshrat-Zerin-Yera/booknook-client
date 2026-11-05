
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Pencil,
  Trash2,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";

import type { FormEvent } from "react";
import type { Book } from "@/types/book";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function MyBooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [deletedBookTitle, setDeletedBookTitle] = useState("");

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);
  const [updatedBookTitle, setUpdatedBookTitle] = useState("");
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Fetch only the logged-in user's books

useEffect(() => {
  if (isPending) return;

  // Redirect logged-out users
  if (!session) {
    router.replace("/login");
    return;
  }

  async function fetchBooks() {
    try {
      setError("");

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/my-books`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch your books."
        );
      }

      setBooks(Array.isArray(result.data) ? result.data : []);
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
}, [isPending, session, router]);


  // Delete a book
  async function handleDelete() {
    if (!deleteTarget || deletingId) return;

    const bookToDelete = deleteTarget;

    try {
      setDeletingId(bookToDelete._id);
      setError("");

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please log in before deleting a book.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookToDelete._id}`,
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

      // Remove book from the list
      setBooks((previousBooks) =>
        previousBooks.filter(
          (book) => book._id !== bookToDelete._id
        )
      );

      // Close confirmation modal
      setDeleteTarget(null);

      // Show deletion success modal
      setDeletedBookTitle(bookToDelete.title);
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
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingBook || saving) return;

    const cleanTitle = editingBook.title.trim();
    const cleanAuthor = editingBook.author.trim();
    const cleanCategory = editingBook.category.trim();
    const cleanCover = editingBook.cover.trim();
    const cleanDescription = editingBook.description.trim();

    if (
      !cleanTitle ||
      !cleanAuthor ||
      !cleanCategory ||
      !cleanCover ||
      !cleanDescription
    ) {
      setError("All fields are required.");
      return;
    }

    if (cleanTitle.length < 2 || cleanTitle.length > 120) {
      setError("Title must be between 2 and 120 characters.");
      return;
    }

    if (cleanAuthor.length < 2 || cleanAuthor.length > 80) {
      setError("Author must be between 2 and 80 characters.");
      return;
    }

    if (!categories.includes(cleanCategory)) {
      setError("Please select a valid category.");
      return;
    }

    if (
      cleanDescription.length < 10 ||
      cleanDescription.length > 1000
    ) {
      setError(
        "Description must be between 10 and 1000 characters."
      );
      return;
    }

    try {
      const imageURL = new URL(cleanCover);

      if (!["http:", "https:"].includes(imageURL.protocol)) {
        throw new Error("Invalid image URL.");
      }
    } catch {
      setError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please log in before editing a book.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${editingBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            title: cleanTitle,
            author: cleanAuthor,
            category: cleanCategory,
            cover: cleanCover,
            description: cleanDescription,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update book."
        );
      }

      // Update the local book using the saved form values
      const updatedBook: Book = {
        ...editingBook,
        ...(result.data ?? {}),
        title: cleanTitle,
        author: cleanAuthor,
        category: cleanCategory,
        cover: cleanCover,
        description: cleanDescription,
      };

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book._id === editingBook._id ? updatedBook : book
        )
      );

      // Close edit modal
      setEditingBook(null);
      setError("");

      // Show update success modal
      setUpdatedBookTitle(cleanTitle);
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
      <p className="py-20 text-center text-[#174c3c]">
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

      {/* General Error Message */}
      {error && !editingBook && !deleteTarget && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700"
        >
          <AlertCircle size={20} />
          <p className="flex-1">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* EDIT BOOK MODAL */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

            <button
              type="button"
              onClick={() => {
                setEditingBook(null);
                setError("");
              }}
              disabled={saving}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              aria-label="Close edit form"
            >
              <X size={20} />
            </button>

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#a17b45]">
              Manage Your Collection
            </p>

            <h2 className="mb-6 text-2xl font-bold text-[#174c3c]">
              Edit Book
            </h2>

            {/* Edit form error */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={20} />
                <p className="flex-1">{error}</p>

                <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Dismiss error"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">

              {/* Title */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Book Title
                </label>

                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      title: e.target.value,
                    })
                  }
                  required
                  minLength={2}
                  maxLength={120}
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#174c3c]"
                />
              </div>

              {/* Author */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Author
                </label>

                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      author: e.target.value,
                    })
                  }
                  required
                  minLength={2}
                  maxLength={80}
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#174c3c]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  value={editingBook.category}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      category: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-[#174c3c]"
                >
                  <option value="">Select a category</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cover Image */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Cover Image URL
                </label>

                <input
                  type="text"
                  value={editingBook.cover}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      cover: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#174c3c]"
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
                  minLength={10}
                  maxLength={1000}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#174c3c]"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBook(null);
                    setError("");
                  }}
                  disabled={saving}
                  className="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#174c3c] px-6 py-3 font-semibold text-white hover:bg-[#123b2f] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={26} />
            </div>

            <h2 className="text-2xl font-bold text-[#174c3c]">
              Delete Book?
            </h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>?
              This action cannot be undone.
            </p>

            {/* Delete error */}
            {error && (
              <div
                role="alert"
                className="mt-5 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setError("");
                }}
                disabled={deletingId !== null}
                className="rounded-lg bg-gray-100 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK UPDATED SUCCESS MODAL */}
      {updatedBookTitle && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle size={36} />
            </div>

            <h2 className="text-2xl font-bold text-[#174c3c]">
              Book Updated Successfully!
            </h2>

            <p className="mt-3 text-gray-600">
              <strong>{updatedBookTitle}</strong> has been
              successfully updated in your collection.
            </p>

            <button
              type="button"
              onClick={() => setUpdatedBookTitle("")}
              className="mt-8 w-full rounded-lg bg-[#174c3c] px-6 py-3 font-semibold text-white transition hover:bg-[#123b2f]"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* BOOK DELETED SUCCESS MODAL */}
      {deletedBookTitle && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle size={36} />
            </div>

            <h2 className="text-2xl font-bold text-[#174c3c]">
              Book Deleted!
            </h2>

            <p className="mt-3 text-gray-600">
              <strong>{deletedBookTitle}</strong> has been
              successfully removed from your collection.
            </p>

            <button
              type="button"
              onClick={() => setDeletedBookTitle("")}
              className="mt-8 w-full rounded-lg bg-[#174c3c] px-6 py-3 font-semibold text-white transition hover:bg-[#123b2f]"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* BOOKS LIST */}
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
                  onClick={() => {
                    setError("");
                    setEditingBook({ ...book });
                  }}
                  className="flex items-center gap-2 rounded-lg bg-[#e9eee9] px-4 py-2 text-sm font-semibold text-[#174c3c] transition hover:bg-[#dce6dc]"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setDeleteTarget(book);
                  }}
                  disabled={deletingId !== null}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Delete
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


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookOpen, RotateCcw } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  borrowDate: string;
  returnDate: string;
  returnedAt: string | null;
}

export default function MyBorrowsList() {
  // State
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState<string | null>(null);

  // Router and authentication
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // Fetch borrow records
  useEffect(() => {
    if (isPending || !session) return;

    async function fetchBorrows() {
      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please log in to view your borrowed books.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch borrow records."
          );
        }

        setBorrows(result.data);
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

    fetchBorrows();
  }, [isPending, session]);

  // Return a borrowed book
  async function handleReturn(borrowId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setReturningId(borrowId);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows/${borrowId}`,
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
          result.message || "Failed to return book."
        );
      }

      // Remove returned book from the list
      setBorrows((previousBorrows) =>
        previousBorrows.filter(
          (borrow) => borrow._id !== borrowId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setReturningId(null);
    }
  }

  // Authentication loading / redirect
  if (isPending || !session) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[#174c3c]">
          Checking authentication...
        </p>
      </section>
    );
  }

  // Borrow records loading
  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-gray-500">
          Loading your borrowed books...
        </p>
      </section>
    );
  }

  // Error handling
  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

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

      {borrows.length === 0 ? (
        <div className="rounded-2xl border border-[#e8e3d8] bg-white p-10 text-center">
          <BookOpen
            className="mx-auto mb-4 text-[#174c3c]"
            size={40}
          />

          <h2 className="text-xl font-bold text-[#174c3c]">
            No borrowed books yet
          </h2>

          <p className="mt-2 text-gray-500">
            Visit All Books to find your next read.
          </p>

          <Link
            href="/books"
            className="mt-5 inline-block rounded-lg bg-[#174c3c] px-5 py-2 text-white"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {borrows.map((borrow) => (
            <article
              key={borrow._id}
              className="flex gap-5 rounded-2xl border border-[#e8e3d8] bg-white p-5 shadow-sm"
            >
              <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-lg bg-[#eeeae1]">
                {borrow.bookImage && (
                  <Image
                    src={borrow.bookImage}
                    alt={borrow.bookTitle}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <span className="w-fit rounded-full bg-[#e9eee9] px-3 py-1 text-xs font-semibold text-[#174c3c]">
                  {borrow.returnedAt ? "Returned" : "Borrowed"}
                </span>

                <h2 className="mt-3 text-lg font-bold text-[#243b32]">
                  {borrow.bookTitle}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Borrowed:{" "}
                  {new Date(borrow.borrowDate).toLocaleDateString()}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Return date:{" "}
                  {new Date(borrow.returnDate).toLocaleDateString()}
                </p>

                <Link
                  href={`/books/${borrow.bookId}`}
                  className="mt-auto flex items-center gap-2 pt-4 text-sm font-semibold text-[#174c3c] hover:underline"
                >
                  <BookOpen size={16} />
                  View Book
                </Link>

                <button
                  type="button"
                  onClick={() => handleReturn(borrow._id)}
                  disabled={returningId === borrow._id}
                  className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#174c3c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#23634f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RotateCcw size={15} />
                  {returningId === borrow._id
                    ? "Returning..."
                    : "Return Book"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookOpen, RotateCcw, X } from "lucide-react";
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
  const [selectedBorrowId, setSelectedBorrowId] = useState<string | null>(null);

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

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {/* Heading */}
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-red-50 p-4 text-red-600">
          <p>{error}</p>
          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Empty State */}
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
        /* Borrowed Books Table */
        <div className="overflow-x-auto rounded-2xl border border-[#e8e3d8] bg-white shadow-sm">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-[#f5f4ef]">
              <tr>
                <th className="px-6 py-5 text-sm font-semibold text-[#174c3c]">
                  Book
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-[#174c3c]">
                  Borrow Date
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-[#174c3c]">
                  Return Date
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-[#174c3c]">
                  Status
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-[#174c3c]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {borrows.map((borrow) => (
                <tr
                  key={borrow._id}
                  className="border-t border-[#e8e3d8] transition hover:bg-[#faf9f6]"
                >
                  {/* Book Image and Title */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-[#eeeae1]">
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

                      <Link
                        href={`/books/${borrow.bookId}`}
                        className="font-semibold text-[#174c3c] hover:underline"
                      >
                        {borrow.bookTitle}
                      </Link>
                    </div>
                  </td>

                  {/* Borrow Date */}
                  <td className="px-6 py-5 text-sm text-gray-600">
                    {new Date(
                      borrow.borrowDate
                    ).toLocaleDateString()}
                  </td>

                  {/* Return Date */}
                  <td className="px-6 py-5 text-sm text-gray-600">
                    {new Date(
                      borrow.returnDate
                    ).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-[#e9eee9] px-3 py-1 text-xs font-semibold text-[#174c3c]">
                      Borrowed
                    </span>
                  </td>

                  {/* Return Button */}
                  <td className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBorrowId(borrow._id)
                      }
                      disabled={returningId === borrow._id}
                      className="flex items-center gap-2 rounded-lg bg-[#174c3c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#23634f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RotateCcw size={15} />
                      Return Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Return Confirmation Modal */}
      {selectedBorrowId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#174c3c]">
                Return this book?
              </h2>

              <button
                type="button"
                onClick={() => setSelectedBorrowId(null)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            <p className="text-gray-600">
              Are you sure you want to return this borrowed book?
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedBorrowId(null)}
                disabled={returningId !== null}
                className="rounded-lg border border-gray-200 px-5 py-2 text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={returningId !== null}
                onClick={async () => {
                  const borrowId = selectedBorrowId;
                  setSelectedBorrowId(null);
                  await handleReturn(borrowId);
                }}
                className="rounded-lg bg-[#174c3c] px-5 py-2 font-semibold text-white transition hover:bg-[#23634f] disabled:opacity-60"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

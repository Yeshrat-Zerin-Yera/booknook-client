
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface BorrowButtonProps {
  bookId: string;
}

export default function BorrowButton({ bookId }: BorrowButtonProps) {
  const { data: session, isPending } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";

  async function handleBorrow() {
    setError("");

    if (!session?.user) {
      setError("Please log in before borrowing a book.");
      return;
    }

    try {
      setLoading(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            bookId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to borrow this book.");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setSuccess(false);
          setIsOpen(true);
        }}
        disabled={isPending}
        className="mt-8 w-fit rounded-xl bg-[#174c3c] px-8 py-3 font-semibold text-white transition hover:bg-[#23634f] disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Loading..." : "Borrow This Book"}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() => !loading && setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="borrow-title"
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {success ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e9eee9] text-2xl text-[#174c3c]">
                  ✓
                </div>

                <h2 className="text-2xl font-bold text-[#174c3c]">
                  Book Borrowed!
                </h2>

                <p className="mt-3 text-gray-600">
                  Your book has been borrowed successfully. You can view
                  your borrowing record on the My Borrows page.
                </p>

                <Link
                  href="/my-borrows"
                  className="mt-6 inline-block rounded-xl bg-[#174c3c] px-6 py-3 font-semibold text-white hover:bg-[#23634f]"
                >
                  Go to My Borrows
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 block w-full py-2 text-sm font-semibold text-gray-500 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2
                  id="borrow-title"
                  className="text-2xl font-bold text-[#174c3c]"
                >
                  Confirm Your Borrow
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Please review your account details before confirming.
                </p>

                {!session?.user ? (
                  <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    Please log in to borrow this book.
                  </p>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={userName}
                        readOnly
                        className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        readOnly
                        className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                      />
                    </div>

                    <p className="text-sm text-gray-500">
                      Borrowing period: 7 days from the borrow date.
                    </p>
                  </div>
                )}

                {error && (
                  <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="mt-7 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  {session?.user ? (
                    <button
                      type="button"
                      onClick={handleBorrow}
                      disabled={loading || !userName || !userEmail}
                      className="flex-1 rounded-xl bg-[#174c3c] px-4 py-3 font-semibold text-white hover:bg-[#23634f] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "Confirming..." : "Confirm Borrow"}
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex-1 rounded-xl bg-[#174c3c] px-4 py-3 text-center font-semibold text-white hover:bg-[#23634f]"
                    >
                      Log In
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

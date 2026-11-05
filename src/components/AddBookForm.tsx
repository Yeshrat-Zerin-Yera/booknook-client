
"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { BookPlus, CheckCircle, XCircle, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Toast = {
  message: string;
  type: "success" | "error";
} | null;

export default function AddBookForm() {
  // Authentication
  const { data: session, isPending } = authClient.useSession();

  // Book form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");

  // Submission and notification state
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [totalCopies, setTotalCopies] = useState("1");
  const cleanTotalCopies = Number(totalCopies);

  // Display toast notification
  function showToast(message: string, type: "success" | "error") {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({ message, type });

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  // Clean up toast timer
  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  // Submit form
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    if (isPending || !session) {
      showToast("Please log in before adding a book.", "error");
      return;
    }

    // Trim whitespace
    const cleanTitle = title.trim();
    const cleanAuthor = author.trim();
    const cleanCategory = category.trim();
    const cleanCover = cover.trim();
    const cleanDescription = description.trim();

    // Validate empty fields
    if (
      !cleanTitle ||
      !cleanAuthor ||
      !cleanCategory ||
      !cleanCover ||
      !cleanDescription
    ) {
      showToast("All fields are required.", "error");
      return;
    }

    if (
      !Number.isInteger(cleanTotalCopies) ||
      cleanTotalCopies < 1 ||
      cleanTotalCopies > 1000
    ) {
      showToast(
        "Total copies must be a whole number between 1 and 1000.",
        "error"
      );
      return;
    }

    // Validate category
    const allowedCategories = [
      "Fiction",
      "Science",
      "History",
      "Kids",
      "Others",
    ];

    if (!allowedCategories.includes(cleanCategory)) {
      showToast("Please select a valid category.", "error");
      return;
    }

    // Validate title
    if (cleanTitle.length < 2 || cleanTitle.length > 120) {
      showToast(
        "Title must be between 2 and 120 characters.",
        "error"
      );
      return;
    }

    // Validate author
    if (cleanAuthor.length < 2 || cleanAuthor.length > 80) {
      showToast(
        "Author name must be between 2 and 80 characters.",
        "error"
      );
      return;
    }

    // Validate description
    if (
      cleanDescription.length < 10 ||
      cleanDescription.length > 1000
    ) {
      showToast(
        "Description must be between 10 and 1000 characters.",
        "error"
      );
      return;
    }

    // Validate image URL
    try {
      const imageURL = new URL(cleanCover);

      if (!["http:", "https:"].includes(imageURL.protocol)) {
        throw new Error("Invalid image URL");
      }
    } catch {
      showToast(
        "Please enter a valid HTTP or HTTPS image URL.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      // Get JWT from Better Auth
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please log in before adding a book.");
      }

      // Send authenticated request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books`,
        {
          method: "POST",
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
            copies: cleanTotalCopies,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add book.");
      }

      // Success notification
      showToast("Book added successfully!", "success");

      // Reset form
      setTitle("");
      setAuthor("");
      setCategory("");
      setCover("");
      setDescription("");
      setTotalCopies("1");
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  // Authentication loading
  if (isPending) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[#174c3c]">Checking authentication...</p>
      </section>
    );
  }

  // Require login
  if (!session) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-[#174c3c]">
          Login Required
        </h1>
        <p className="mt-3 text-gray-600">
          Please log in before adding a book.
        </p>
        <a
          href="/login"
          className="mt-5 rounded-xl bg-[#174c3c] px-6 py-3 text-white"
        >
          Go to Login
        </a>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      {/* Toast Notification */}
      {toast && (
        <div
          role="alert"
          className={`fixed right-5 top-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl p-4 shadow-lg ${toast.type === "success"
            ? "bg-[#174c3c] text-white"
            : "bg-red-600 text-white"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={22} />
          ) : (
            <XCircle size={22} />
          )}

          <p className="flex-1 text-sm font-medium">
            {toast.message}
          </p>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Heading */}
      <div className="mb-10 text-center">
        <BookPlus className="mx-auto mb-4 h-12 w-12 text-[#174c3c]" />

        <h1 className="text-4xl font-bold text-[#174c3c]">
          Add a New Book
        </h1>

        <p className="mt-3 text-gray-600">
          Share another wonderful book with our library.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#e8e3d8] bg-white p-6 shadow-sm sm:p-10"
      >
        {/* User Name */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Your Name
          </label>

          <input
            type="text"
            value={session.user.name || ""}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-[#e8e3d8] bg-gray-100 px-4 py-3 text-gray-600 outline-none"
          />
        </div>

        {/* User Email */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Your Email
          </label>

          <input
            type="email"
            value={session.user.email || ""}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-[#e8e3d8] bg-gray-100 px-4 py-3 text-gray-600 outline-none"
          />
        </div>

        {/* Book Title */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Book Title
          </label>

          <input
            type="text"
            required
            minLength={2}
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter book title"
            className="w-full rounded-xl border border-[#e8e3d8] px-4 py-3 outline-none focus:border-[#174c3c]"
          />
        </div>

        {/* Author */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Author
          </label>

          <input
            type="text"
            required
            minLength={2}
            maxLength={80}
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Enter author name"
            className="w-full rounded-xl border border-[#e8e3d8] px-4 py-3 outline-none focus:border-[#174c3c]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Category
          </label>

          <select
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-[#e8e3d8] bg-white px-4 py-3 outline-none focus:border-[#174c3c]"
          >
            <option value="">Select a category</option>
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Kids">Kids</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Total Copies */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Total Copies
          </label>

          <input
            type="number"
            required
            min={1}
            max={1000}
            step={1}
            value={totalCopies}
            onChange={(event) => setTotalCopies(event.target.value)}
            placeholder="Enter total copies"
            className="w-full rounded-xl border border-[#e8e3d8] px-4 py-3 outline-none focus:border-[#174c3c]"
          />

          <p className="mt-1 text-sm text-gray-500">
            How many copies of this book are available in your library?
          </p>
        </div>

        {/* Cover Image */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Cover Image URL
          </label>

          <input
            type="text"
            required
            maxLength={2048}
            value={cover}
            onChange={(event) => setCover(event.target.value)}
            placeholder="https://example.com/book-cover.jpg"
            className="w-full rounded-xl border border-[#e8e3d8] px-4 py-3 outline-none focus:border-[#174c3c]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Description
          </label>

          <textarea
            required
            minLength={10}
            maxLength={1000}
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a short description about the book..."
            className="w-full resize-y rounded-xl border border-[#e8e3d8] px-4 py-3 outline-none focus:border-[#174c3c]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#174c3c] px-6 py-3.5 font-semibold text-white transition hover:bg-[#10382c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </section>
  );
}

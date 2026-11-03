"use client";

import { useState } from "react";
import { BookPlus } from "lucide-react";

export default function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            author,
            category,
            cover,
            description,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add book");
      }

      setSubmitted(true);

      // Clear the form after successful submission.
      setTitle("");
      setAuthor("");
      setCategory("");
      setCover("");
      setDescription("");
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

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
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
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Book Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter book title"
            className="w-full rounded-xl border border-[#e8e3d8] px-4 py-3 outline-none focus:border-[#174c3c]"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Author
          </label>
          <input
            type="text"
            required
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Enter author name"
            className="w-full rounded-xl border border-[#e8e3d8] px-4 py-3 outline-none focus:border-[#174c3c]"
          />
        </div>

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
            <option value="Classic">Classic</option>
            <option value="Romance">Romance</option>
            <option value="Science">Science</option>
            <option value="Adventure">Adventure</option>
            <option value="Mystery">Mystery</option>
            <option value="Poetry">Poetry</option>
            <option value="Education">Education</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Cover Image URL
          </label>
          <input
            type="url"
            required
            value={cover}
            onChange={(event) => setCover(event.target.value)}
            placeholder="https://example.com/book-cover.jpg"
            className="w-full rounded-xl border border-[#e8e3d8] px-4 py-3 outline-none focus:border-[#174c3c]"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Description
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a short description about the book..."
            className="w-full resize-y rounded-xl border border-[#e8e3d8] px-4 py-3 outline-none focus:border-[#174c3c]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#174c3c] px-6 py-3.5 font-semibold text-white transition hover:bg-[#10382c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Adding Book..." : "Add Book"}
        </button>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {submitted && (
          <p
            role="status"
            className="rounded-lg bg-[#e9eee9] p-4 text-sm text-[#174c3c]"
          >
            Book added successfully!
          </p>
        )}

        {submitted && (
          <p role="status" className="rounded-lg bg-[#e9eee9] p-4 text-sm text-[#174c3c]">
            Your form is valid! Book saving will be enabled when we connect the backend.
          </p>
        )}
      </form>
    </section>
  );
}

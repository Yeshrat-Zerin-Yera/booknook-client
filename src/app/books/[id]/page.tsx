
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Book } from "@/types/book";
import BorrowButton from "@/components/BorrowButton";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

// Fetch a single book from the backend
async function getBook(id: string): Promise<Book | null> {
  // Validate MongoDB ObjectId before making the API request
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return null;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
    { cache: "no-store" }
  );

  // Book doesn't exist
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }

  const result = await response.json();

  return result.data;
}

// Dynamic page metadata
export async function generateMetadata({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const book = await getBook(id);

  return {
    title: book
      ? `${book.title} | BookNook`
      : "Book Not Found | BookNook",
  };
}

// Book details page
export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const book = await getBook(id);

  // Show custom 404 page if book doesn't exist
  if (!book) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Link
        href="/books"
        className="mb-8 inline-block font-semibold text-[#174c3c] hover:text-[#a17c45]"
      >
        ← Back to All Books
      </Link>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Book Cover */}
        <div className="relative mx-auto h-[450px] w-full max-w-sm overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Book Information */}
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#a17c45]">
            {book.category}
          </p>

          <h1 className="text-4xl font-bold text-[#174c3c]">
            {book.title}
          </h1>

          <p className="mt-4 text-lg text-gray-500">
            By {book.author}
          </p>

          <div className="my-8 h-px bg-gray-200" />

          <h2 className="mb-3 text-xl font-semibold text-[#174c3c]">
            About This Book
          </h2>

          <p className="leading-8 text-gray-600">
            {book.description}
          </p>

          {/* Borrow Button */}
          <BorrowButton bookId={book._id} />
        </div>
      </div>
    </section>
  );
}

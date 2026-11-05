
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Book } from "@/types/book";
import BorrowButton from "@/components/BorrowButton";
import RequireAuth from "@/components/RequireAuth";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function getBook(id: string): Promise<Book | null> {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return null;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
    { cache: "no-store" }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }

  const result = await response.json();
  return result.data;
}

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

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return (
    <RequireAuth>
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

            {/* Added By Section */}
            <div className="mt-8 rounded-xl border border-[#e8e5dc] bg-[#faf9f6] p-5">
              <h2 className="mb-4 text-lg font-semibold text-[#174c3c]">
                Added By
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Name
                  </p>
                  <p className="mt-1 font-medium text-gray-700">
                    {book.createdByName || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Email
                  </p>
                  <p className="mt-1 break-all text-gray-600">
                    {book.createdByEmail || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Borrow Button */}
            <div className="mt-6">
              <BorrowButton bookId={book._id} />
            </div>
          </div>
        </div>
      </section>
    </RequireAuth>
  );
}

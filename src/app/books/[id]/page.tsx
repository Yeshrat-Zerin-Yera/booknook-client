import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { books } from "@/data/books";

interface BookDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: BookDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  const book = books.find(
    (item) => item.id === Number(id)
  );

  return {
    title: book ? `${book.title} | BookNook` : "Book Not Found | BookNook",
  };
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;

  const book = books.find(
    (item) => item.id === Number(id)
  );

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-6 py-16">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/books"
          className="mb-10 inline-flex items-center gap-2 font-semibold text-[#174c3c] hover:text-[#a17c45]"
        >
          <ArrowLeft size={18} />
          Back to All Books
        </Link>

        <div className="grid gap-12 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-2 md:p-12">

          <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-[#eeeae1]">
            <Image
              src={book.cover}
              alt={book.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-[#e9eee9] px-4 py-2 text-sm font-semibold text-[#174c3c]">
              {book.category}
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-[#174c3c]">
              {book.title}
            </h1>

            <p className="mt-4 text-lg text-gray-500">
              Written by {book.author}
            </p>

            <div className="my-8 h-px bg-[#e8e3d8]" />

            <h2 className="text-xl font-bold text-[#243b32]">
              About This Book
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              {book.description}
            </p>

            <div className="mt-8">
              <p className="mb-4 text-sm text-gray-500">
                Interested in reading this book?
              </p>

              <button
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-[#174c3c] px-7 py-3.5 font-semibold text-white opacity-60"
              >
                <BookOpen size={18} />
                Borrow Book (Coming Soon)
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

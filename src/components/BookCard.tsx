import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/books/${book._id}`}>
        <div className="relative h-72 overflow-hidden bg-gray-100">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9b7653]">
          {book.category}
        </span>

        <h3 className="mt-2 line-clamp-1 text-xl font-bold text-[#174c3c]">
          {book.title}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          by {book.author}
        </p>

        <Link
          href={`/books/${book._id}`}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#174c3c] px-5 py-3 font-semibold text-white transition hover:bg-[#123b2f]"
        >
          <BookOpen size={18} />
          View Details
        </Link>
      </div>
    </article>
  );
}
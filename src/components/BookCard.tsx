import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  category: string;
  cover: string;
}

export default function BookCard({
  id,
  title,
  author,
  category,
  cover,
}: BookCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e8e3d8] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden bg-[#eeeae1]">
        <Image
          src={cover}
          alt={title}
          fill
          unoptimized
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <span className="rounded-full bg-[#e9eee9] px-3 py-1 text-xs font-semibold text-[#174c3c]">
          {category}
        </span>

        <h3 className="mt-4 line-clamp-1 text-lg font-bold text-[#243b32]">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          By {author}
        </p>

        <Link
          href={`/books/${id}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-[#174c3c] px-4 py-2.5 font-semibold text-[#174c3c] transition hover:bg-[#174c3c] hover:text-white"
        >
          <BookOpen size={17} />
          View Details
        </Link>
      </div>
    </article>
  );
}

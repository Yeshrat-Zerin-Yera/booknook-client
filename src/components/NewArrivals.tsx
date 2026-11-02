import Link from "next/link";
import BookCard from "@/components/BookCard";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
  },
  {
    id: 2,
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    category: "Fiction",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
  },
  {
    id: 3,
    title: "The Art of Reading",
    author: "David Ulin",
    category: "Literature",
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600",
  },
  {
    id: 4,
    title: "Into the Wild",
    author: "Jon Krakauer",
    category: "Adventure",
    cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
  },
  {
    id: 5,
    title: "The Silent Library",
    author: "M. J. Rose",
    category: "Mystery",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600",
  },
  {
    id: 6,
    title: "A Thousand Stories",
    author: "Jane Smith",
    category: "Fiction",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600",
  },
];

export default function NewArrivals() {
  return (
    <section className="bg-[#faf9f6] px-6 py-20">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#a17c45]">
              Fresh From Our Shelves
            </p>

            <h2 className="text-3xl font-bold text-[#174c3c] sm:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-3 max-w-xl text-gray-600">
              Discover the latest additions to our growing collection.
              Your next favorite book might be here.
            </p>
          </div>

          <Link
            href="/books"
            className="font-semibold text-[#174c3c] transition hover:text-[#a17c45]"
          >
            Explore All Books →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>

      </div>
    </section>
  );
}

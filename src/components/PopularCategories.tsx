import Link from "next/link";
import {
  BookOpen,
  Heart,
  FlaskConical,
  Compass,
  Feather,
  GraduationCap,
} from "lucide-react";

const categories = [
  { name: "Fiction", icon: BookOpen },
  { name: "Romance", icon: Heart },
  { name: "Science", icon: FlaskConical },
  { name: "Adventure", icon: Compass },
  { name: "Poetry", icon: Feather },
  { name: "Education", icon: GraduationCap },
];

export default function PopularCategories() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#a17c45]">
            Explore Your Interests
          </p>
          <h2 className="text-3xl font-bold text-[#174c3c] sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-3 text-gray-600">
            Find books that match your mood and interests.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/books?category=${category.name}`}
                className="group flex flex-col items-center rounded-2xl border border-[#e8e3d8] bg-[#faf9f6] p-7 transition hover:-translate-y-2 hover:bg-[#174c3c]"
              >
                <Icon className="mb-4 h-9 w-9 text-[#174c3c] transition group-hover:text-white" />
                <span className="font-semibold text-[#243b32] transition group-hover:text-white">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

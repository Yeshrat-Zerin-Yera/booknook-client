import {
  BookOpen,
  Users,
  BookmarkCheck,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "A Growing Collection",
    description:
      "Explore books across different genres, subjects, and interests.",
  },
  {
    icon: Users,
    title: "A Reading Community",
    description:
      "Discover stories and share your love of reading with others.",
  },
  {
    icon: BookmarkCheck,
    title: "Easy Borrowing",
    description:
      "Find a book, borrow it, and keep track of your reading journey.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#174c3c] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#e8d9b5]">
            The BookNook Experience
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Why Choose BookNook?
          </h2>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/15 bg-white/10 p-8 text-center transition hover:-translate-y-2 hover:bg-white/15"
              >
                <Icon className="mx-auto mb-5 h-11 w-11 text-[#e8d9b5]" />

                <h3 className="mb-3 text-xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="leading-7 text-gray-200">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

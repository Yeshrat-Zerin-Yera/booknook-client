"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    subtitle: "WELCOME TO BOOKNOOK",
    title: "Every Book Holds a New Adventure.",
    description:
      "Discover wonderful stories, explore new ideas, and find your next favorite book in our cozy online library.",
    buttonText: "Browse Books",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  },
  {
    id: 2,
    subtitle: "YOUR NEXT CHAPTER STARTS HERE",
    title: "Find Stories That Stay With You.",
    description:
      "From timeless classics to exciting discoveries, there's always something beautiful waiting to be read.",
    buttonText: "Explore Collection",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    id: 3,
    subtitle: "READ. BORROW. SHARE.",
    title: "Good Books Are Meant to Be Shared.",
    description:
      "Borrow books, discover new perspectives, and become part of a community that loves reading.",
    buttonText: "Start Exploring",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
  },
];

export default function HeroSlider() {
  return (
    <section className="bg-[#faf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl">

        <Swiper
          modules={[
            Navigation,
            Pagination,
            Autoplay,
            EffectFade,
          ]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          effect="fade"
          loop
          className="booknook-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="relative flex min-h-[480px] items-center bg-cover bg-center px-8 py-16 sm:px-16 lg:min-h-[550px] lg:px-24"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      90deg,
                      rgba(12, 39, 29, 0.94) 0%,
                      rgba(12, 39, 29, 0.75) 50%,
                      rgba(12, 39, 29, 0.15) 100%
                    ),
                    url(${slide.image})
                  `,
                }}
              >
                <div className="relative z-10 max-w-2xl pb-8 text-white">

                  <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-[#e8d9b5]">
                    {slide.subtitle}
                  </span>

                  <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mb-8 max-w-xl text-base leading-8 text-gray-200 sm:text-lg">
                    {slide.description}
                  </p>

                  <Link
                    href="/books"
                    className="inline-flex items-center rounded-xl bg-[#e8d9b5] px-7 py-3.5 font-semibold text-[#174c3c] transition duration-300 hover:-translate-y-1 hover:bg-white"
                  >
                    {slide.buttonText}
                    <span className="ml-2">→</span>
                  </Link>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}

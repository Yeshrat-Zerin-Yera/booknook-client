import Link from "next/link";
import {
    BookOpen,
    Mail,
    MapPin,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#174c3c] text-[#faf9f6]">

            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

                {/* Brand Section */}
                <div>
                    <Link href="/" className="mb-4 inline-flex items-center gap-2">
                        <BookOpen className="h-8 w-8" />

                        <span className="text-2xl font-bold">
                            BookNook
                        </span>
                    </Link>

                    <p className="max-w-xs text-sm leading-7 text-[#d5e0d9]">
                        A cozy corner for every book lover.
                        Discover new stories, borrow your
                        favorite books, and share the joy
                        of reading.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="mb-5 text-lg font-semibold">
                        Quick Links
                    </h3>

                    <ul className="space-y-3 text-sm text-[#d5e0d9]">
                        <li>
                            <Link href="/" className="hover:text-white">
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link href="/books" className="hover:text-white">
                                All Books
                            </Link>
                        </li>

                        <li>
                            <Link href="/add-book" className="hover:text-white">
                                Add Book
                            </Link>
                        </li>

                        <li>
                            <Link href="/my-books" className="hover:text-white">
                                My Books
                            </Link>
                        </li>

                        <li>
                            <Link href="/my-borrows" className="hover:text-white">
                                My Borrows
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div>
                    <h3 className="mb-5 text-lg font-semibold">
                        Get in Touch
                    </h3>

                    <ul className="space-y-4 text-sm text-[#d5e0d9]">
                        <li className="flex items-center gap-3">
                            <Mail className="h-5 w-5 shrink-0" />
                            <a
                                href="mailto:hello@booknook.com"
                                className="hover:text-white"
                            >
                                hello@booknook.com
                            </a>
                        </li>

                        <li className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 shrink-0" />
                            <span>Dhaka, Bangladesh</span>
                        </li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h3 className="mb-5 text-lg font-semibold">
                        Follow Us
                    </h3>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="font-bold text-lg hover:text-blue-500"
                        >
                            f
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="font-bold text-lg hover:text-pink-500"
                        >
                            IG
                        </a>

                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="font-bold text-lg hover:text-gray-500"
                        >
                            GH
                        </a>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-[#d5e0d9]">
                        Stay connected and discover
                        your next favorite story.
                    </p>
                </div>

            </div>

            {/* Copyright */}
            <div className="border-t border-white/15 px-6 py-5 text-center">
                <p className="text-sm text-[#d5e0d9]">
                   © 2026 BookNook.
                    All rights reserved.
                </p>
            </div>

        </footer>
    );
}

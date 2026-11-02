"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e8e3d8] bg-[#faf9f6]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-[#174c3c] p-2">
            <BookOpen className="h-6 w-6 text-white" />
          </div>

          <span className="text-2xl font-bold tracking-tight text-[#174c3c]">
            BookNook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-medium text-gray-700 transition hover:text-[#174c3c]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Authentication Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-5 py-2 font-medium text-[#174c3c] transition hover:bg-[#e9eee9]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-[#174c3c] px-5 py-2 font-medium text-white transition hover:bg-[#10382c]"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#174c3c] md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-[#e8e3d8] bg-[#faf9f6] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700 hover:text-[#174c3c]"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-[#e8e3d8]" />

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="font-medium text-[#174c3c]"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#174c3c] px-5 py-2 text-center font-medium text-white"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

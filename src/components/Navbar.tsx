
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();

  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
  ];

  const privateLinks = [
    { name: "Add Book", href: "/add-book" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrows", href: "/my-borrows" },
  ];

  const user = session?.user;

  async function handleLogout() {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    setProfileOpen(false);
    setIsOpen(false);
    router.push("/");
    router.refresh();
  }

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
        <div className="hidden items-center gap-6 lg:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-medium text-gray-700 transition hover:text-[#174c3c]"
            >
              {link.name}
            </Link>
          ))}

          {user &&
            privateLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-medium text-gray-700 transition hover:text-[#174c3c]"
              >
                {link.name}
              </Link>
            ))}
        </div>

        {/* Desktop Actions */}
        <div className="relative hidden items-center gap-3 md:flex">

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Enable dark mode"
                : "Enable light mode"
            }
            title={
              theme === "light" ? "Dark Mode" : "Light Mode"
            }
            className="rounded-lg border border-[#e8e3d8] p-2 text-[#174c3c] transition hover:bg-[#e9eee9]"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {isPending ? (
            <span className="text-sm text-gray-500">
              Loading...
            </span>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-[#e9eee9]"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-[#e8e3d8] object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#174c3c] font-semibold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <ChevronDown className="h-4 w-4 text-[#174c3c]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-56 rounded-xl border border-[#e8e3d8] bg-white p-3 shadow-lg">
                  <p className="border-b border-[#e8e3d8] px-3 pb-3 font-semibold text-[#174c3c]">
                    {user.name}
                  </p>

                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-gray-700 transition hover:bg-[#e9eee9]"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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

            {publicLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-medium text-gray-700 hover:text-[#174c3c]"
              >
                {link.name}
              </Link>
            ))}

            {user &&
              privateLinks.map((link) => (
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

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg border border-[#e8e3d8] p-3 text-[#174c3c]"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}

              <span className="font-medium">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </button>

            {isPending ? (
              <p className="text-sm text-gray-500">
                Loading...
              </p>
            ) : user ? (
              <>
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#174c3c] font-semibold text-white">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <span className="font-semibold text-[#174c3c]">
                    {user.name}
                  </span>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-gray-700 hover:text-[#174c3c]"
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-[#174c3c] px-5 py-2 text-center font-medium text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}


"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhotoURL = photoURL.trim();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name: cleanName,
        email: cleanEmail,
        password,
        image: cleanPhotoURL,
      });

      if (error) {
        setError(error.message ?? "Registration failed.");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL:
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      });
    } catch {
      setError("Google login failed. Please try again.");
    }
  }

  

return (
  <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
    <h1 className="mb-2 text-3xl font-bold text-green-900">
      Create Account
    </h1>

    <p className="mb-6 text-gray-500">
      Join BookNook and discover your next favorite book.
    </p>

    <form onSubmit={handleRegister} className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded-lg border p-3"
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-lg border p-3"
      />

      <input
        type="url"
        placeholder="Profile Photo URL"
        value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)}
        required
        className="w-full rounded-lg border p-3"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
        className="w-full rounded-lg border p-3"
      />

      <p className="-mt-2 text-xs text-gray-500">
        Minimum 6 characters, including uppercase and lowercase letters.
      </p>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-green-900 p-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Register"}
      </button>
    </form>

    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-sm text-gray-400">OR</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>

    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 p-3 font-semibold text-gray-700 hover:bg-gray-50"
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="h-5 w-5"
      />
      Continue with Google
    </button>

    <p className="mt-5 text-center text-sm text-gray-500">
      Already have an account?{" "}
      <a
        href="/login"
        className="font-semibold text-green-900 hover:underline"
      >
        Login
      </a>
    </p>
  </div>
);


}

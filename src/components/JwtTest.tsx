"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";


export default function JwtTest() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function testJWT() {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await authClient.token();

      console.log("JWT:", data?.token);

      if (error || !data?.token) {
        setMessage(error?.message || "JWT generation failed.");
        return;
      }

      setMessage("JWT generated successfully!");
      console.log("JWT received:", Boolean(data.token));
    } catch {
      setMessage("Something went wrong while generating JWT.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto my-10 max-w-md rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold text-green-900">
        JWT Authentication Test
      </h2>

      <button
        onClick={testJWT}
        disabled={loading}
        className="w-full rounded-lg bg-green-900 p-3 text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate JWT"}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}

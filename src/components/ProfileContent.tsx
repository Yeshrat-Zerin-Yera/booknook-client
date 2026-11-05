"use client";

import { authClient } from "@/lib/auth-client";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfileContent() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <section className="min-h-[60vh]">
        <LoadingSpinner
          message="Loading your profile..."
          fullScreen
        />
      </section>
    );
  }

  if (!session) {
    return (
      <p className="p-10 text-center">
        Please log in to view your profile.
      </p>
    );
  }

  const user = session.user;

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-900 text-3xl text-white">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <h1 className="text-3xl font-bold text-green-900">
          {user.name}
        </h1>

        <p className="mt-2 text-gray-500">{user.email}</p>

        <p className="mt-6 text-sm text-gray-400">
          Welcome to your BookNook profile.
        </p>
      </div>
    </section>
  );
}
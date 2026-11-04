"use client";

import { authClient } from "@/lib/auth-client";

export default function AuthTest() {
  const { data: session, isPending, error } =
    authClient.useSession();

  if (isPending) {
    return <p>Checking session...</p>;
  }

  if (error) {
    return <p>Auth error: {error.message}</p>;
  }

  return (
    <div>
      {session ? (
        <p>Welcome, {session.user.name}!</p>
      ) : (
        <p>No user is currently logged in.</p>
      )}
    </div>
  );
}
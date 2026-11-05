"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[#174c3c]">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}

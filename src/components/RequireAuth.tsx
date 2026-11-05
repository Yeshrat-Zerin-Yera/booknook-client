"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LoadingSpinner from "@/components/LoadingSpinner";

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
            <div className="min-h-[60vh]">
                <LoadingSpinner
                    message="Checking authentication..."
                    fullScreen
                />
            </div>
        );
    }

    return <>{children}</>;
}

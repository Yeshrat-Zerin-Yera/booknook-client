
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Get the intended destination after login.
    function getSafeRedirectPath() {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");

        if (!redirect) return "/";

        try {
            const url = new URL(redirect, window.location.origin);

            if (url.origin !== window.location.origin) {
                return "/";
            }

            return url.pathname + url.search + url.hash;
        } catch {
            return "/";
        }
    }

    // Email and password login
    async function handleLogin(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                setError(error.message ?? "Something went wrong");
                return;
            }

            // Confirm that Better Auth can retrieve the session.
            let authenticated = false;

            for (let attempt = 0; attempt < 10; attempt++) {
                const result = await authClient.getSession();

                if (result.data?.session) {
                    authenticated = true;
                    break;
                }

                await new Promise((resolve) =>
                    setTimeout(resolve, 300)
                );
            }

            if (!authenticated) {
                setError(
                    "Login succeeded, but your session could not be confirmed. Please try again."
                );
                return;
            }

            // Navigate with a full browser reload.
            const redirectPath = getSafeRedirectPath();

            window.location.replace(redirectPath);

        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    // Google login
    async function handleGoogleLogin() {
        setError("");

        try {
            const redirectPath = getSafeRedirectPath();

            const appUrl =
                process.env.NEXT_PUBLIC_APP_URL ||
                window.location.origin;

            await authClient.signIn.social({
                provider: "google",
                callbackURL: `${appUrl}${redirectPath}`,
            });
        } catch {
            setError("Google login failed. Please try again.");
        }
    }

    return (
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="mb-2 text-3xl font-bold text-green-900">
                Welcome Back
            </h1>

            <p className="mb-6 text-gray-500">
                Sign in to your BookNook account.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border p-3"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border p-3"
                />

                <div className="flex justify-end">
                    <a
                        href="#"
                        onClick={(event) => event.preventDefault()}
                        className="text-sm font-medium text-green-900 hover:underline"
                    >
                        Forgot Password?
                    </a>
                </div>

                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-green-900 p-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                >
                    {loading ? "Signing In..." : "Login"}
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
                Don't have an account?{" "}
                <a
                    href="/register"
                    className="font-semibold text-green-900 hover:underline"
                >
                    Register
                </a>
            </p>
        </div>
    );
}

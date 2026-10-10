import {
    useState,
    type FormEvent,
} from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../services/api";

interface LoginPageProps {
    mode?: "user" | "admin";
}

export function LoginPage({ mode = "user" }: LoginPageProps) {
    const { login, adminLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = (
        location.state as { message?: string } | null
    )?.message;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            if (mode === "admin") {
                await adminLogin(email, password);
            } else {
                await login(email, password);
            }

            const from =
                (
                    location.state as
                    | {
                        from?: {
                            pathname?: string;
                            search?: string;
                            hash?: string;
                        };
                    }
                    | null
                )?.from;

            const destination =
                mode === "admin"
                    ? "/admin"
                    : `${from?.pathname ?? "/"}${from?.search ?? ""}${from?.hash ?? ""}`;

            navigate(destination, { replace: true });
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage(
                    "Unable to sign in. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        Restaurant Explorer
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-neutral-950">
                        {mode === "admin" ? "Administrator sign in" : "Welcome back"}
                    </h1>

                    <p className="mt-3 text-neutral-600">
                        {mode === "admin"
                            ? "Sign in to manage restaurants and reviews."
                            : "Sign in to manage your reviews and favorite restaurants."}
                    </p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                    {successMessage && (
                        <div
                            role="status"
                            className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                        >
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div
                            role="alert"
                            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {errorMessage}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-neutral-800"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-neutral-800"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                minLength={8}
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-neutral-950 px-4 py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Signing in..."
                                : "Sign in"}
                        </button>
                    </form>

                    {mode === "user" && (
                        <p className="mt-6 text-center text-sm text-neutral-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-neutral-950 underline underline-offset-4"
                            >
                                Create one
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
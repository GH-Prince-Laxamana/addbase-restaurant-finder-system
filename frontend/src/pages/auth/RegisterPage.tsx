import { buttonStyles, fieldStyles } from "../../components/ui/styles";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password);
      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please log in.",
        },
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-[480px]">
        <Link
          to="/"
          className="mb-8 inline-block text-sm font-medium text-wine hover:text-burgundy"
        >
          Back to Hapag
        </Link>

        <section>
          <div className="mb-8 text-center">
            <p className="mb-2 font-display text-[1.25rem] font-medium text-neutral-500">
              Hapag
            </p>
            <h1 className="text-[2.7rem] font-medium text-neutral-950">
              Create your account
            </h1>
            <p className="mt-2 text-neutral-600">
              Discover and save your favorite restaurants.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-neutral-700"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                required
                minLength={2}
                maxLength={100}
                className={fieldStyles}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-neutral-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className={fieldStyles}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-neutral-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className={fieldStyles}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-neutral-700"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                required
                className={fieldStyles}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={buttonStyles("primary", "w-full transition disabled:cursor-not-allowed disabled:opacity-60")}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-wine hover:text-burgundy"
            >
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
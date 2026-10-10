import { buttonStyles } from "../components/ui/styles";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-lg text-center">

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-wine">
          Hapag
        </p>

        <h1 className="text-7xl font-extrabold text-neutral-950">404</h1>

        <h2 className="mt-4 text-2xl font-bold text-neutral-800">
          Oops! Page not found
        </h2>

        <p className="mx-auto mt-3 max-w-sm leading-6 text-neutral-600">
          Looks like this page is off the menu. The page you're looking for
          may have moved or doesn't exist.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className={buttonStyles("primary", "inline-flex items-center justify-center transition")}
          >
            Back to Home
          </Link>

          <Link
            to="/restaurants"
            className={buttonStyles("secondary", "inline-flex items-center justify-center text-neutral-700 transition")}
          >
            Explore Restaurants
          </Link>
        </div>
      </section>
    </main>
  );
}
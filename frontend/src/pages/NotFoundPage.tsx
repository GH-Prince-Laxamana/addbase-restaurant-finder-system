import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg sm:p-12">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
          <span className="text-5xl" role="img" aria-label="Restaurant">
            🍽️
          </span>
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
          Restaurant Explorer
        </p>

        <h1 className="text-7xl font-extrabold text-gray-900">404</h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Oops! Page not found
        </h2>

        <p className="mx-auto mt-3 max-w-sm leading-6 text-gray-600">
          Looks like this page is off the menu. The page you're looking for
          may have moved or doesn't exist.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Back to Home
          </Link>

          <Link
            to="/restaurants"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Explore Restaurants
          </Link>
        </div>
      </section>
    </main>
  );
}
import { useMemo, useState, type FormEvent } from "react";

import { useAdminRestaurants } from "../../hooks/useAdminRestaurants";
import type { AdminRestaurantListQuery } from "../../services/admin.service";

export function AdminRestaurantsPage() {
    const [searchInput, setSearchInput] = useState("");
    const [q, setQ] = useState("");
    const [borough, setBorough] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [status, setStatus] =
        useState<"all" | "active" | "inactive">("all");
    const [sort, setSort] =
        useState<"name" | "rating" | "reviews">("name");
    const [page, setPage] = useState(1);

    const query = useMemo<AdminRestaurantListQuery>(
        () => ({
            q: q || undefined,
            borough: borough || undefined,
            cuisine: cuisine || undefined,
            status,
            sort,
            page,
            limit: 20,
        }),
        [q, borough, cuisine, status, sort, page]
    );

    const { data, isLoading, error, refetch } =
        useAdminRestaurants(query);

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setQ(searchInput.trim());
        setPage(1);
    }

    function resetFilters() {
        setSearchInput("");
        setQ("");
        setBorough("");
        setCuisine("");
        setStatus("all");
        setSort("name");
        setPage(1);
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <header className="mb-8">
                <p className="text-sm font-medium text-neutral-500">
                    Administration
                </p>
                <h1 className="mt-2 text-3xl font-bold">
                    Restaurant management
                </h1>
                <p className="mt-2 text-neutral-600">
                    Search, filter, and review restaurants in the database.
                </p>
            </header>

            <form
                onSubmit={handleSearch}
                className="mb-6 flex flex-col gap-3 sm:flex-row"
            >
                <input
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search by name or restaurant ID"
                    aria-label="Search restaurants"
                    className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-4 py-3"
                />
                <button
                    type="submit"
                    className="rounded-lg bg-neutral-950 px-5 py-3 font-medium text-white"
                >
                    Search
                </button>
            </form>

            <section
                aria-label="Restaurant filters"
                className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
                <label className="text-sm">
                    <span className="mb-1 block">Borough</span>
                    <input
                        value={borough}
                        onChange={(event) => {
                            setBorough(event.target.value);
                            setPage(1);
                        }}
                        placeholder="e.g. Bronx"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    />
                </label>

                <label className="text-sm">
                    <span className="mb-1 block">Cuisine</span>
                    <input
                        value={cuisine}
                        onChange={(event) => {
                            setCuisine(event.target.value);
                            setPage(1);
                        }}
                        placeholder="e.g. Bakery"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    />
                </label>

                <label className="text-sm">
                    <span className="mb-1 block">Status</span>
                    <select
                        value={status}
                        onChange={(event) => {
                            setStatus(
                                event.target.value as
                                | "all"
                                | "active"
                                | "inactive"
                            );
                            setPage(1);
                        }}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    >
                        <option value="all">All restaurants</option>
                        <option value="active">Active only</option>
                        <option value="inactive">Inactive only</option>
                    </select>
                </label>

                <label className="text-sm">
                    <span className="mb-1 block">Sort by</span>
                    <select
                        value={sort}
                        onChange={(event) => {
                            setSort(
                                event.target.value as
                                | "name"
                                | "rating"
                                | "reviews"
                            );
                            setPage(1);
                        }}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    >
                        <option value="name">Name</option>
                        <option value="rating">Highest rated</option>
                        <option value="reviews">Most reviewed</option>
                    </select>
                </label>
            </section>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-600">
                    {data
                        ? `${data.pagination.total} restaurants found`
                        : "Restaurant results"}
                </p>

                <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm underline underline-offset-4"
                >
                    Clear filters
                </button>
            </div>

            {isLoading && (
                <p role="status" className="py-8 text-center">
                    Loading restaurants...
                </p>
            )}

            {error && !isLoading && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 p-5"
                >
                    <p>Unable to load restaurants: {error.message}</p>
                    <button
                        type="button"
                        onClick={refetch}
                        className="mt-3 underline underline-offset-4"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!isLoading && !error && data && (
                <>
                    {data.results.length === 0 ? (
                        <div className="rounded-xl border border-neutral-200 p-10 text-center">
                            <h2 className="text-lg font-semibold">
                                No restaurants found
                            </h2>
                            <p className="mt-2 text-sm text-neutral-600">
                                Try adjusting your search or filters.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-neutral-200">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="bg-neutral-50 text-neutral-600">
                                    <tr>
                                        <th className="px-5 py-4 font-medium">
                                            Restaurant
                                        </th>
                                        <th className="px-5 py-4 font-medium">
                                            Cuisine
                                        </th>
                                        <th className="px-5 py-4 font-medium">
                                            Borough
                                        </th>
                                        <th className="px-5 py-4 font-medium">
                                            Rating
                                        </th>
                                        <th className="px-5 py-4 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-neutral-200">
                                    {data.results.map((restaurant) => (
                                        <tr key={restaurant._id}>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-neutral-950">
                                                    {restaurant.name}
                                                </p>
                                                <p className="mt-1 text-xs text-neutral-500">
                                                    ID: {restaurant.restaurantId}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                {restaurant.cuisine}
                                            </td>

                                            <td className="px-5 py-4">
                                                {restaurant.borough}
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                {Number(
                                                    restaurant.avgScore
                                                ).toFixed(1)}{" "}
                                                / 5
                                                <span className="ml-1 text-neutral-500">
                                                    ({restaurant.scoreCount})
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={
                                                        restaurant.isActive
                                                            ? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800"
                                                            : "rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                                                    }
                                                >
                                                    {restaurant.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {data.pagination.totalPages > 1 && (
                        <nav
                            aria-label="Restaurant pagination"
                            className="mt-6 flex flex-wrap items-center justify-center gap-4"
                        >
                            <button
                                type="button"
                                disabled={
                                    !data.pagination.hasPreviousPage
                                }
                                onClick={() =>
                                    setPage((current) => current - 1)
                                }
                                className="rounded-lg border border-neutral-300 px-4 py-2 disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-neutral-600">
                                Page {data.pagination.page} of{" "}
                                {data.pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={!data.pagination.hasNextPage}
                                onClick={() =>
                                    setPage((current) => current + 1)
                                }
                                className="rounded-lg border border-neutral-300 px-4 py-2 disabled:opacity-40"
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </>
            )}
        </main>
    );
}
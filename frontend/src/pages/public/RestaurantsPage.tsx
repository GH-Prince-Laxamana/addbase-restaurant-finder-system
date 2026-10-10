import { useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useRestaurants } from "../../hooks/useRestaurants";
import type { RestaurantQuery, RestaurantSort } from "../../services/restaurant.service";
import { getRestaurantImage } from "../../utils/restaurantImages";

const PAGE_SIZE = 12;

export function RestaurantsPage() {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") ?? "";
    const initialCuisine = searchParams.get("cuisine") ?? "";

    const [searchInput, setSearchInput] = useState(initialQuery);
    const [q, setQ] = useState(initialQuery);
    const [cuisine, setCuisine] = useState(initialCuisine);
    const [borough, setBorough] = useState("");
    const [minRating, setMinRating] = useState("");
    const [sort, setSort] = useState<RestaurantSort>("rating");
    const [page, setPage] = useState(1);

    const query = useMemo<RestaurantQuery>(
        () => ({
            q: q || undefined,
            cuisine: cuisine || undefined,
            borough: borough || undefined,
            minRating: minRating ? Number(minRating) : undefined,
            sort,
            page,
            limit: PAGE_SIZE,
        }),
        [q, cuisine, borough, minRating, sort, page]
    );

    const { data, isLoading, error, refetch } = useRestaurants(query);

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setQ(searchInput.trim());
        setPage(1);
    }

    function resetFilters() {
        setSearchInput("");
        setQ("");
        setCuisine("");
        setBorough("");
        setMinRating("");
        setSort("rating");
        setPage(1);
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Explore restaurants</h1>
                <p className="mt-2 text-neutral-600">
                    Search and discover restaurants from our database.
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
                    placeholder="Search restaurants..."
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
                className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
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
                    <span className="mb-1 block">Minimum rating</span>
                    <select
                        value={minRating}
                        onChange={(event) => {
                            setMinRating(event.target.value);
                            setPage(1);
                        }}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    >
                        <option value="">Any rating</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="4.5">4.5+</option>
                    </select>
                </label>

                <label className="text-sm">
                    <span className="mb-1 block">Sort by</span>
                    <select
                        value={sort}
                        onChange={(event) => {
                            setSort(event.target.value as RestaurantSort);
                            setPage(1);
                        }}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                    >
                        <option value="rating">Highest rated</option>
                        <option value="reviews">Most reviewed</option>
                        <option value="name">Name</option>
                    </select>
                </label>
            </section>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
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
                <p role="status" className="py-12 text-center">
                    Loading restaurants...
                </p>
            )}

            {error && !isLoading && (
                <div role="alert" className="rounded-lg border border-red-200 p-5">
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
                        <p className="py-12 text-center text-neutral-600">
                            No restaurants match your search.
                        </p>
                    ) : (
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {data.results.map((restaurant) => (
                                <li
                                    key={restaurant._id}
                                    className="rounded-xl border border-neutral-200 p-5"
                                >
                                    <img
                                        src={getRestaurantImage(restaurant._id)}
                                        alt="Restaurant food"
                                        loading="lazy"
                                        className="mb-4 aspect-16/10 w-full rounded-lg object-cover"
                                    />
                                    
                                    <p className="text-sm text-neutral-500">
                                        {restaurant.cuisine} · {restaurant.borough}
                                    </p>

                                    <h2 className="mt-2 text-lg font-semibold">
                                        <Link
                                            to={`/restaurants/${restaurant._id}`}
                                            className="hover:underline"
                                        >
                                            {restaurant.name}
                                        </Link>
                                    </h2>

                                    <p className="mt-3 text-sm text-neutral-600">
                                        {restaurant.address.street}
                                        {restaurant.address.zipcode
                                            ? `, ${restaurant.address.zipcode}`
                                            : ""}
                                    </p>

                                    <p className="mt-3 text-sm">
                                        Rating: {Number(restaurant.avgScore).toFixed(1)}
                                        {" · "}
                                        {restaurant.scoreCount} reviews
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}

                    {data.pagination.totalPages > 1 && (
                        <nav
                            aria-label="Restaurant pagination"
                            className="mt-8 flex items-center justify-center gap-4"
                        >
                            <button
                                type="button"
                                disabled={!data.pagination.hasPreviousPage}
                                onClick={() => setPage((current) => current - 1)}
                                className="rounded-lg border px-4 py-2 disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="text-sm">
                                Page {data.pagination.page} of{" "}
                                {data.pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={!data.pagination.hasNextPage}
                                onClick={() => setPage((current) => current + 1)}
                                className="rounded-lg border px-4 py-2 disabled:opacity-40"
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
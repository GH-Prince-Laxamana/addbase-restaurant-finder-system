import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRestaurants } from "../../hooks/useRestaurants";

import { getRestaurantImage } from "../../utils/restaurantImages";

export function HomePage() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");

    const { data, isLoading, error, refetch } = useRestaurants({
        sort: "rating",
        page: 1,
        limit: 6,
    });

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const query = searchInput.trim();

        navigate(
            query
                ? `/restaurants?q=${encodeURIComponent(query)}`
                : "/restaurants"
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <section className="rounded-2xl bg-neutral-950 px-6 py-12 text-white sm:px-10 sm:py-16">
                <p className="text-sm font-medium uppercase tracking-widest text-neutral-300">
                    Restaurant Explorer
                </p>

                <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                    Find your next favorite restaurant.
                </h1>

                <p className="mt-4 max-w-xl text-neutral-300">
                    Discover restaurants, explore cuisines, and read reviews
                    from other diners.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(event) =>
                            setSearchInput(event.target.value)
                        }
                        placeholder="Restaurant, cuisine, or borough"
                        aria-label="Search restaurants"
                        className="min-w-0 flex-1 rounded-lg bg-white px-4 py-3 text-neutral-950 outline-none focus:ring-2 focus:ring-neutral-400"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-white px-6 py-3 font-semibold text-neutral-950 hover:bg-neutral-200"
                    >
                        Search restaurants
                    </button>
                </form>
            </section>

            <section className="mt-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-neutral-500">
                            Discover
                        </p>
                        <h2 className="mt-2 text-2xl font-bold">
                            Explore by cuisine
                        </h2>
                    </div>

                    <Link
                        to="/restaurants"
                        className="text-sm font-medium underline underline-offset-4"
                    >
                        View all restaurants
                    </Link>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mt-5 rounded-lg border border-red-200 p-4"
                    >
                        <p>Unable to load restaurant data: {error.message}</p>
                        <button
                            type="button"
                            onClick={refetch}
                            className="mt-2 text-sm underline underline-offset-4"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {isLoading && (
                    <p role="status" className="mt-5">
                        Loading cuisines...
                    </p>
                )}

                {!isLoading && !error && data && (
                    <div className="mt-5 flex flex-wrap gap-2">
                        {data.facets.cuisine.slice(0, 8).map((item) => (
                            <Link
                                key={item._id}
                                to={`/restaurants?cuisine=${encodeURIComponent(item._id)}`}
                                className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
                            >
                                {item._id}
                                <span className="ml-2 text-neutral-500">
                                    {item.count}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="mt-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-neutral-500">
                            From our database
                        </p>
                        <h2 className="mt-2 text-2xl font-bold">
                            Restaurants to explore
                        </h2>
                    </div>

                    <Link
                        to="/restaurants"
                        className="text-sm font-medium underline underline-offset-4"
                    >
                        Browse all
                    </Link>
                </div>

                {isLoading && (
                    <p role="status" className="mt-5">
                        Loading restaurants...
                    </p>
                )}

                {!isLoading && !error && data && (
                    <>
                        {data.results.length === 0 ? (
                            <p className="mt-5 text-neutral-600">
                                No restaurants are available right now.
                            </p>
                        ) : (
                            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {data.results.map((restaurant) => (
                                    <li
                                        key={restaurant._id}
                                        className="rounded-xl border border-neutral-200 p-5"
                                    >

                                        <img
                                            src={getRestaurantImage(restaurant._id)}
                                            alt={`${restaurant.cuisine} restaurant`}
                                            loading="lazy"
                                            className="mb-4 aspect-16/10 w-full rounded-lg object-cover"
                                        />
                                        
                                        <p className="text-sm text-neutral-500">
                                            {restaurant.cuisine} ·{" "}
                                            {restaurant.borough}
                                        </p>

                                        <h3 className="mt-2 text-lg font-semibold">
                                            <Link
                                                to={`/restaurants/${restaurant._id}`}
                                                className="hover:underline"
                                            >
                                                {restaurant.name}
                                            </Link>
                                        </h3>

                                        <p className="mt-3 text-sm text-neutral-600">
                                            {restaurant.address.street},{" "}
                                            {restaurant.address.zipcode}
                                        </p>

                                        <p className="mt-3 text-sm">
                                            {Number(restaurant.avgScore).toFixed(1)}
                                            {" / 5 · "}
                                            {restaurant.scoreCount} reviews
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}
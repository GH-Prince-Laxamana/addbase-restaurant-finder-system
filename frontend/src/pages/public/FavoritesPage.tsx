import { Link } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";

export function FavoritesPage() {
    const {
        favorites,
        isLoading,
        isMutating,
        error,
        refetch,
        remove,
    } = useFavorites();

    async function handleRemove(restaurantId: string) {
        try {
            await remove(restaurantId);
        } catch {
            // The hook exposes the error for the page to display.
        }
    }

    if (isLoading) {
        return (
            <main className="mx-auto max-w-5xl px-6 py-12">
                <p role="status">Loading favorites...</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Your favorites</h1>
                <p className="mt-2 text-neutral-600">
                    The restaurants you've saved for later.
                </p>
            </header>

            {error && (
                <div
                    role="alert"
                    className="mb-6 rounded-lg border border-red-200 p-4"
                >
                    <p>{error.message}</p>
                    <button
                        type="button"
                        onClick={refetch}
                        className="mt-2 text-sm underline underline-offset-4"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!error && favorites.length === 0 ? (
                <section className="rounded-xl border border-neutral-200 px-6 py-12 text-center">
                    <h2 className="text-xl font-semibold">
                        No favorites yet
                    </h2>
                    <p className="mt-3 text-neutral-600">
                        Browse restaurants and save the ones you'd like to visit.
                    </p>
                    <Link
                        to="/restaurants"
                        className="mt-6 inline-block rounded-lg bg-neutral-950 px-5 py-3 font-medium text-white"
                    >
                        Explore restaurants
                    </Link>
                </section>
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((favorite) => {
                        const restaurant = favorite.restaurant;

                        return (
                            <li
                                key={favorite._id}
                                className="flex flex-col rounded-xl border border-neutral-200 p-5"
                            >
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

                                <p className="mt-3 flex-1 text-sm text-neutral-600">
                                    {restaurant.address.street},{" "}
                                    {restaurant.address.zipcode}
                                </p>

                                <p className="mt-3 text-sm">
                                    {Number(restaurant.avgScore).toFixed(1)} / 5
                                    {" · "}
                                    {restaurant.scoreCount} reviews
                                </p>

                                {!restaurant.isActive && (
                                    <p className="mt-3 text-sm text-amber-700">
                                        This restaurant is currently unavailable.
                                    </p>
                                )}

                                <button
                                    type="button"
                                    disabled={isMutating}
                                    onClick={() => {
                                        void handleRemove(restaurant._id);
                                    }}
                                    className="mt-5 self-start text-sm font-medium text-red-700 underline underline-offset-4 disabled:opacity-50"
                                >
                                    {isMutating
                                        ? "Removing..."
                                        : "Remove favorite"}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </main>
    );
}
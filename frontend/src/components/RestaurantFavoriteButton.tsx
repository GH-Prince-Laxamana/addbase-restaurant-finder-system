import { useState } from "react";
import { useFavorites } from "../hooks/useFavorites";

interface RestaurantFavoriteButtonProps {
    restaurantId: string;
}

export function RestaurantFavoriteButton({
    restaurantId,
}: RestaurantFavoriteButtonProps) {
    const {
        favorites,
        isLoading,
        isMutating,
        error,
        refetch,
        add,
        remove,
    } = useFavorites();

    const [actionError, setActionError] = useState("");

    const isFavorite = favorites.some(
        (favorite) => favorite.restaurant._id === restaurantId
    );

    async function handleToggle() {
        setActionError("");

        try {
            if (isFavorite) {
                await remove(restaurantId);
            } else {
                await add(restaurantId);
            }
        } catch (err) {
            setActionError(
                err instanceof Error
                    ? err.message
                    : "Unable to update favorites."
            );
        }
    }

    if (isLoading) {
        return (
            <p role="status" className="mt-4 text-sm text-neutral-500">
                Checking favorites...
            </p>
        );
    }

    if (error && favorites.length === 0) {
        return (
            <div className="mt-4">
                <p role="alert" className="text-sm text-red-700">
                    Unable to load favorites: {error.message}
                </p>
                <button
                    type="button"
                    onClick={refetch}
                    className="mt-2 text-sm underline underline-offset-4"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="mt-5">
            <button
                type="button"
                disabled={isMutating}
                onClick={() => void handleToggle()}
                aria-pressed={isFavorite}
                className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50"
            >
                {isMutating
                    ? "Updating..."
                    : isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
            </button>

            {actionError && (
                <p role="alert" className="mt-2 text-sm text-red-700">
                    {actionError}
                </p>
            )}
        </div>
    );
}
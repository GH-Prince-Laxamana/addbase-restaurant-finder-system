import { useCallback, useEffect, useState } from "react";
import {
    addFavorite,
    getFavorites,
    removeFavorite,
} from "../services/favorite.service";
import type { Favorite } from "../types/api";

export function useFavorites() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        getFavorites()
            .then((result) => {
                if (!cancelled) {
                    setFavorites(result);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setFavorites([]);
                    setError(
                        err instanceof Error
                            ? err
                            : new Error("Unable to load favorites.")
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const refetch = useCallback(() => {
        setReloadKey((current) => current + 1);
    }, []);

    const add = useCallback(
        async (restaurantId: string) => {
            setIsMutating(true);
            setError(null);

            try {
                const favorite = await addFavorite(restaurantId);

                refetch();

                return favorite;
            } catch (err) {
                const nextError =
                    err instanceof Error
                        ? err
                        : new Error("Unable to add favorite.");

                setError(nextError);
                throw nextError;
            } finally {
                setIsMutating(false);
            }
        },
        [refetch]
    );

    const remove = useCallback(
        async (restaurantId: string) => {
            setIsMutating(true);
            setError(null);

            try {
                await removeFavorite(restaurantId);
                refetch();
            } catch (err) {
                const nextError =
                    err instanceof Error
                        ? err
                        : new Error("Unable to remove favorite.");

                setError(nextError);
                throw nextError;
            } finally {
                setIsMutating(false);
            }
        },
        [refetch]
    );

    return {
        favorites,
        isLoading,
        isMutating,
        error,
        refetch,
        add,
        remove,
    };
}
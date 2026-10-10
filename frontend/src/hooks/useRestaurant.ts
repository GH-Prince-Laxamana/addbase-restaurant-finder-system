import { useCallback, useEffect, useState } from "react";
import { getRestaurantById } from "../services/restaurant.service";
import type { RestaurantDetail } from "../types/api";

export function useRestaurant(id: string | undefined) {
    const [data, setData] = useState<RestaurantDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        if (!id) {
            setData(null);
            setError(new Error("Restaurant ID is required."));
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        getRestaurantById(id)
            .then((restaurant) => {
                if (!cancelled) {
                    setData(restaurant);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err
                            : new Error("Unable to load restaurant.")
                    );
                    setData(null);
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
    }, [id, reloadKey]);

    const refetch = useCallback(() => {
        setReloadKey((current) => current + 1);
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch,
    };
}
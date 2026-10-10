import { useCallback, useEffect, useMemo, useState } from "react";
import {
    getRestaurants,
    type RestaurantQuery,
} from "../services/restaurant.service";
import type { RestaurantListResponse } from "../types/api";

export function useRestaurants(query: RestaurantQuery = {}) {
    const queryKey = JSON.stringify(query);

    const stableQuery = useMemo(
        () => JSON.parse(queryKey) as RestaurantQuery,
        [queryKey]
    );

    const [data, setData] = useState<RestaurantListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        getRestaurants(stableQuery)
            .then((response) => {
                if (!cancelled) {
                    setData(response);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err
                            : new Error("Unable to load restaurants.")
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
    }, [stableQuery, reloadKey]);

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
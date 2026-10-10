import { useCallback, useEffect, useMemo, useState } from "react";
import {
    getAdminRestaurants,
    type AdminRestaurantListQuery,
    type AdminRestaurantListResponse,
} from "../services/admin.service";

export function useAdminRestaurants(
    query: AdminRestaurantListQuery = {}
) {
    const queryKey = JSON.stringify(query);

    const stableQuery = useMemo(
        () => JSON.parse(queryKey) as AdminRestaurantListQuery,
        [queryKey]
    );

    const [data, setData] =
        useState<AdminRestaurantListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        getAdminRestaurants(stableQuery)
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
                            : new Error("Unable to load admin restaurants.")
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
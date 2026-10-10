import { useCallback, useEffect, useMemo, useState } from "react";
import {
    getAdminOverview,
    getAdminRestaurantStats,
    type AdminOverviewStats,
    type AdminRestaurantStats,
    type AdminRestaurantStatsQuery,
} from "../services/admin.service";

export function useAdminOverview() {
    const [data, setData] = useState<AdminOverviewStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        getAdminOverview()
            .then((result) => {
                if (!cancelled) {
                    setData(result);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err
                            : new Error("Unable to load admin overview.")
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

    return { data, isLoading, error, refetch };
}

export function useAdminRestaurantStats(
    query: AdminRestaurantStatsQuery = {}
) {
    const queryKey = JSON.stringify(query);

    const stableQuery = useMemo(
        () => JSON.parse(queryKey) as AdminRestaurantStatsQuery,
        [queryKey]
    );

    const [data, setData] = useState<AdminRestaurantStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        getAdminRestaurantStats(stableQuery)
            .then((result) => {
                if (!cancelled) {
                    setData(result);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err
                            : new Error("Unable to load restaurant analytics.")
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

    return { data, isLoading, error, refetch };
}
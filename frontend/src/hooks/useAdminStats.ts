import { useCallback, useMemo } from "react";
import { getAdminOverview, getAdminRestaurantStats, type AdminRestaurantStatsQuery } from "../services/admin.service";
import { useResource } from "./useResource";
export function useAdminOverview() { return useResource("overview", getAdminOverview); }
export function useAdminRestaurantStats(query: AdminRestaurantStatsQuery = {}) {
    const key = JSON.stringify(query);
    const stableQuery = useMemo(() => JSON.parse(key) as AdminRestaurantStatsQuery, [key]);
    const request = useCallback(() => getAdminRestaurantStats(stableQuery), [stableQuery]);
    return useResource(key, request);
}

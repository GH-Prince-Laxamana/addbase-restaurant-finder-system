import { useCallback, useMemo } from "react";
import { getAdminRestaurants, type AdminRestaurantListQuery } from "../services/admin.service";
import { useResource } from "./useResource";
export function useAdminRestaurants(query: AdminRestaurantListQuery = {}) {
    const key = JSON.stringify(query);
    const stableQuery = useMemo(() => JSON.parse(key) as AdminRestaurantListQuery, [key]);
    const request = useCallback(() => getAdminRestaurants(stableQuery), [stableQuery]);
    return useResource(key, request);
}

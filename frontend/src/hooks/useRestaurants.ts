import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { getRestaurants, type RestaurantQuery } from "../services/restaurant.service";
import { restaurantListCache as cache } from "../utils/restaurantCache";

export function useRestaurants(query: RestaurantQuery = {}) {
    const key = JSON.stringify(query);
    const stableQuery = useMemo(() => JSON.parse(key) as RestaurantQuery, [key]);
    const subscribe = useCallback((listener: () => void) => cache.subscribe(key, listener), [key]);
    const getSnapshot = useCallback(() => cache.getSnapshot(key), [key]);
    const snapshot = useSyncExternalStore(subscribe, getSnapshot);
    useEffect(() => { void cache.fetch(key, () => getRestaurants(stableQuery)); }, [key, stableQuery]);
    const refetch = useCallback(() => { void cache.fetch(key, () => getRestaurants(stableQuery), true); }, [key, stableQuery]);
    return { ...snapshot, showSkeletons: snapshot.isLoading && !snapshot.data, refetch };
}

import type { Restaurant, RestaurantListResponse } from "../types/api";
import { getRestaurantById } from "../services/restaurant.service";
import { createRequestCache } from "./requestCache";
export const restaurantListCache = createRequestCache<RestaurantListResponse>();
const listeners = new Set<(restaurant: Restaurant) => void>();
export function subscribeRestaurantUpdates(listener: (restaurant: Restaurant) => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}
export async function refreshRestaurantCards(id?: string) {
    // Refresh active queries (including rating/review sorting); mark dormant queries stale.
    restaurantListCache.invalidate();
    if (!id) return;
    try {
        const restaurant = await getRestaurantById(id);
        restaurantListCache.update(data => {
            if (!data.results.some(item => item._id === id)) return data;
            return { ...data, results: data.results.map(item => item._id === id ? { ...item, avgScore: restaurant.avgScore, scoreCount: restaurant.scoreCount } : item) };
        });
        listeners.forEach(listener => listener(restaurant));
    } catch {
        // The review already succeeded. Invalidated queries retry when mounted.
    }
}

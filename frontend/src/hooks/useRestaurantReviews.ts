import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createRestaurantReview, deleteReview, getRestaurantReviews, updateReview, type ReviewInput } from "../services/review.service";
import type { RestaurantReview } from "../types/api";
import { createRequestCache } from "../utils/requestCache";
import { refreshRestaurantCards } from "../utils/restaurantCache";

const cache = createRequestCache<RestaurantReview[]>();
export function invalidateRestaurantReviews() { cache.invalidate(); }
const empty: RestaurantReview[] = [];
const missing = { data: null, error: new Error("Restaurant ID is required."), isLoading: false };
export function useRestaurantReviews(restaurantId: string | undefined) {
    const key = restaurantId ?? "";
    const subscribe = useCallback((listener: () => void) => cache.subscribe(key, listener), [key]);
    const getSnapshot = useCallback(() => key ? cache.getSnapshot(key) : missing, [key]);
    const snapshot = useSyncExternalStore(subscribe, getSnapshot);
    const [isMutating, setIsMutating] = useState(false);
    useEffect(() => { if (restaurantId) void cache.fetch(key, () => getRestaurantReviews(restaurantId)); }, [key, restaurantId]);
    const refetch = useCallback(() => { if (restaurantId) void cache.fetch(key, () => getRestaurantReviews(restaurantId), true); }, [key, restaurantId]);
    const refresh = useCallback(async () => {
        if (!restaurantId) return;
        await Promise.all([cache.fetch(key, () => getRestaurantReviews(restaurantId), true), refreshRestaurantCards(restaurantId)]);
    }, [key, restaurantId]);
    const create = useCallback(async (input: ReviewInput) => {
        if (!restaurantId) throw new Error("Restaurant ID is required.");
        setIsMutating(true);
        try { const review = await createRestaurantReview(restaurantId, input); await refresh(); return review; }
        finally { setIsMutating(false); }
    }, [restaurantId, refresh]);
    const update = useCallback(async (reviewId: string, input: Partial<ReviewInput>) => {
        setIsMutating(true);
        try { const review = await updateReview(reviewId, input); await refresh(); return review; }
        finally { setIsMutating(false); }
    }, [refresh]);
    const remove = useCallback(async (reviewId: string) => {
        setIsMutating(true);
        try { await deleteReview(reviewId); await refresh(); }
        finally { setIsMutating(false); }
    }, [refresh]);
    return { reviews: snapshot.data ?? empty, isLoading: snapshot.isLoading && !snapshot.data, isMutating, error: snapshot.error, refetch, create, update, remove };
}

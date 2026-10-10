import type { RestaurantQuery, RestaurantSort } from "../services/restaurant.service";
export function readRestaurantQuery(params: URLSearchParams): RestaurantQuery {
    const rating = Number(params.get("minRating"));
    const rawPage = Number(params.get("page") ?? 1);
    const sort = params.get("sort");
    return {
        q: params.get("q") || undefined,
        cuisine: params.get("cuisine") || undefined,
        borough: params.get("borough") || undefined,
        minRating: rating >= 1 && rating <= 5 ? rating : undefined,
        sort: (sort === "name" || sort === "reviews" ? sort : "rating") as RestaurantSort,
        page: Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1,
        limit: 12,
    };
}
export function updateRestaurantParams(params: URLSearchParams, patch: Record<string, string>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
        if (!value || (key === "page" && value === "1") || (key === "sort" && value === "rating")) next.delete(key);
        else next.set(key, value);
    }
    return next;
}

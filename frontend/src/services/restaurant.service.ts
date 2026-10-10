import { api } from "./api";
import type {
    RestaurantDetail,
    RestaurantListResponse,
} from "../types/api";

export type RestaurantSort = "name" | "rating" | "reviews";

export interface RestaurantQuery {
    q?: string;
    borough?: string;
    cuisine?: string;
    minRating?: number;
    maxRating?: number;
    sort?: RestaurantSort;
    page?: number;
    limit?: number;
}

export async function getRestaurants(
    query: RestaurantQuery = {}
): Promise<RestaurantListResponse> {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") {
            params.set(key, String(value));
        }
    }

    const search = params.toString();
    const path = search
        ? `/restaurants?${search}`
        : "/restaurants";

    return api.get<RestaurantListResponse>(path);
}

export async function getRestaurantById(
    id: string
): Promise<RestaurantDetail> {
    const response = await api.get<{
        restaurant: RestaurantDetail;
    }>(`/restaurants/${encodeURIComponent(id)}`);

    return response.restaurant;
}
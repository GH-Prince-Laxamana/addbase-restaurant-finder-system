import { api } from "./api";
import type {
    Address,
    Restaurant,
    Pagination,
} from "../types/api";

export interface RestaurantInput {
    restaurantId: string;
    name: string;
    cuisine: string;
    borough: string;
    address: Address;
}

export interface AdminReview {
    _id: string;
    restaurant: {
        _id: string;
        name: string;
        restaurantId: string;
    };
    user: {
        _id: string;
        name: string;
        email: string;
    };
    score: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminOverviewStats {
    restaurants: {
        total: number;
        active: number;
        inactive: number;
        averageRating: number;
    };
    users: number;
    reviews: number;
}

export interface RestaurantAnalyticsItem {
    _id: string;
    name?: string;
    restaurantId?: string;
    cuisine?: string;
    borough?: string;
    avgScore?: number;
    scoreCount?: number;
    restaurantCount?: number;
    averageRating?: number;
    reviewCount?: number;
}

export interface AdminRestaurantStats {
    topRated: RestaurantAnalyticsItem[];
    mostReviewed: RestaurantAnalyticsItem[];
    byCuisine: RestaurantAnalyticsItem[];
    byBorough: RestaurantAnalyticsItem[];
}

export interface AdminRestaurantStatsQuery {
    q?: string;
    borough?: string;
    cuisine?: string;
    minRating?: number;
}

export interface AdminRestaurantListQuery {
    q?: string;
    borough?: string;
    cuisine?: string;
    status?: "all" | "active" | "inactive";
    sort?: "name" | "rating" | "reviews";
    page?: number;
    limit?: number;
}

export interface AdminRestaurantListResponse {
    results: Restaurant[];
    pagination: Pagination;
}

export async function createRestaurant(
    input: RestaurantInput
): Promise<Restaurant> {
    const response = await api.post<{ restaurant: Restaurant }>(
        "/admin/restaurants",
        input
    );

    return response.restaurant;
}

export async function updateRestaurant(
    id: string,
    updates: Partial<RestaurantInput>
): Promise<Restaurant> {
    const response = await api.patch<{ restaurant: Restaurant }>(
        `/admin/restaurants/${encodeURIComponent(id)}`,
        updates
    );

    return response.restaurant;
}

export async function softDeleteRestaurant(
    id: string
): Promise<Restaurant> {
    const response = await api.delete<{ restaurant: Restaurant }>(
        `/admin/restaurants/${encodeURIComponent(id)}`
    );

    return response.restaurant;
}

export async function restoreRestaurant(
    id: string
): Promise<Restaurant> {
    const response = await api.patch<{ restaurant: Restaurant }>(
        `/admin/restaurants/${encodeURIComponent(id)}/restore`
    );

    return response.restaurant;
}

export async function permanentlyDeleteRestaurant(
    id: string
): Promise<void> {
    return api.delete<void>(
        `/admin/restaurants/${encodeURIComponent(id)}/permanent`
    );
}

export async function getAdminRestaurants(
    query: AdminRestaurantListQuery = {}
): Promise<AdminRestaurantListResponse> {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") {
            params.set(key, String(value));
        }
    }

    const search = params.toString();
    const path = search
        ? `/admin/restaurants?${search}`
        : "/admin/restaurants";

    return api.get<AdminRestaurantListResponse>(path);
}

export async function getAdminReviews(): Promise<AdminReview[]> {
    const response = await api.get<{ reviews: AdminReview[] }>(
        "/admin/reviews"
    );

    return response.reviews;
}

export async function deleteAdminReview(
    id: string
): Promise<void> {
    return api.delete<void>(
        `/admin/reviews/${encodeURIComponent(id)}`
    );
}

export async function getAdminOverview(): Promise<AdminOverviewStats> {
    const response = await api.get<{ stats: AdminOverviewStats }>(
        "/admin/stats/overview"
    );

    return response.stats;
}

export async function getAdminRestaurantStats(
    query: AdminRestaurantStatsQuery = {}
): Promise<AdminRestaurantStats> {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") {
            params.set(key, String(value));
        }
    }

    const search = params.toString();
    const path = search
        ? `/admin/stats/restaurants?${search}`
        : "/admin/stats/restaurants";

    const response = await api.get<{ stats: AdminRestaurantStats }>(
        path
    );

    return response.stats;
}
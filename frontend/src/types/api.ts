export interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

export interface Address {
    building?: string;
    street: string;
    zipcode: string;
    coord?: [number, number];
}

export interface Review {
    id: string;
    score: number;
    comment: string;
    user: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface RestaurantReview {
    _id: string;
    restaurant: string;
    user:
    | string
    | {
        _id: string;
        name: string;
    };
    score: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface Restaurant {
    _id: string;
    restaurantId: string;
    name: string;
    cuisine: string;
    borough: string;
    address: Address;
    avgScore: number;
    scoreCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RestaurantDetail extends Restaurant {
    reviews: Review[];
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface FacetItem {
    _id: string;
    count: number;
}

export interface RestaurantFacets {
    cuisine: FacetItem[];
    borough: FacetItem[];
    rating: Array<{
        _id: number;
        count: number;
    }>;
}

export interface RestaurantListResponse {
    results: Restaurant[];
    pagination: Pagination;
    facets: RestaurantFacets;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface MeResponse {
    user: User;
}

export interface ReviewListResponse {
    reviews: RestaurantReview[];
}

export interface Favorite {
    _id: string;
    restaurant: Restaurant;
    createdAt: string;
}

export interface FavoriteRecord {
    _id: string;
    user: string;
    restaurant: string;
    createdAt: string;
}
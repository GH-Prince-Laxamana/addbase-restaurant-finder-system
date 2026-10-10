import { api } from "./api";
import type {
    RestaurantReview,
    ReviewListResponse,
} from "../types/api";

export interface ReviewInput {
    score: number;
    comment: string;
}

export async function getRestaurantReviews(
    restaurantId: string
): Promise<RestaurantReview[]> {
    const response = await api.get<ReviewListResponse>(
        `/restaurants/${encodeURIComponent(restaurantId)}/reviews`
    );

    return response.reviews;
}

export async function createRestaurantReview(
    restaurantId: string,
    input: ReviewInput
): Promise<RestaurantReview> {
    const response = await api.post<{
        review: RestaurantReview;
    }>(
        `/restaurants/${encodeURIComponent(restaurantId)}/reviews`,
        input
    );

    return response.review;
}

export async function updateReview(
    reviewId: string,
    input: Partial<ReviewInput>
): Promise<RestaurantReview> {
    const response = await api.patch<{
        review: RestaurantReview;
    }>(
        `/reviews/${encodeURIComponent(reviewId)}`,
        input
    );

    return response.review;
}

export async function deleteReview(
    reviewId: string
): Promise<void> {
    return api.delete<void>(
        `/reviews/${encodeURIComponent(reviewId)}`
    );
}
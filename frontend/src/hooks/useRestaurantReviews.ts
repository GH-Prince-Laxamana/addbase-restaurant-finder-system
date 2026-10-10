import { useCallback, useEffect, useState } from "react";
import {
    createRestaurantReview,
    deleteReview,
    getRestaurantReviews,
    updateReview,
    type ReviewInput,
} from "../services/review.service";
import type { RestaurantReview } from "../types/api";

export function useRestaurantReviews(
    restaurantId: string | undefined
) {
    const [reviews, setReviews] = useState<RestaurantReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        if (!restaurantId) {
            setReviews([]);
            setError(new Error("Restaurant ID is required."));
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        getRestaurantReviews(restaurantId)
            .then((result) => {
                if (!cancelled) {
                    setReviews(result);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setReviews([]);
                    setError(
                        err instanceof Error
                            ? err
                            : new Error("Unable to load reviews.")
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [restaurantId, reloadKey]);

    const refetch = useCallback(() => {
        setReloadKey((current) => current + 1);
    }, []);

    const create = useCallback(
        async (input: ReviewInput) => {
            if (!restaurantId) {
                throw new Error("Restaurant ID is required.");
            }

            setIsMutating(true);

            try {
                const review = await createRestaurantReview(
                    restaurantId,
                    input
                );

                refetch();
                return review;
            } catch (err) {
                throw err instanceof Error
                    ? err
                    : new Error("Unable to create review.");
            } finally {
                setIsMutating(false);
            }
        },
        [restaurantId, refetch]
    );

    const update = useCallback(
        async (
            reviewId: string,
            input: Partial<ReviewInput>
        ) => {
            setIsMutating(true);

            try {
                const review = await updateReview(reviewId, input);

                refetch();
                return review;
            } catch (err) {
                throw err instanceof Error
                    ? err
                    : new Error("Unable to update review.");
            } finally {
                setIsMutating(false);
            }
        },
        [refetch]
    );

    const remove = useCallback(
        async (reviewId: string) => {
            setIsMutating(true);

            try {
                await deleteReview(reviewId);
                refetch();
            } catch (err) {
                throw err instanceof Error
                    ? err
                    : new Error("Unable to delete review.");
            } finally {
                setIsMutating(false);
            }
        },
        [refetch]
    );

    return {
        reviews,
        isLoading,
        isMutating,
        error,
        refetch,
        create,
        update,
        remove,
    };
}
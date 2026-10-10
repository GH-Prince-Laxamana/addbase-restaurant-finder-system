import { useCallback, useEffect, useState } from "react";
import {
    deleteAdminReview,
    getAdminReviews,
    type AdminReview,
} from "../services/admin.service";

export function useAdminReviews() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        getAdminReviews()
            .then((result) => {
                if (!cancelled) {
                    setReviews(result);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
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
    }, [reloadKey]);

    const refetch = useCallback(() => {
        setReloadKey((current) => current + 1);
    }, []);

    const remove = useCallback(async (reviewId: string) => {
        setDeletingId(reviewId);

        try {
            await deleteAdminReview(reviewId);

            setReviews((current) =>
                current.filter((review) => review._id !== reviewId)
            );
        } catch (err) {
            throw err instanceof Error
                ? err
                : new Error("Unable to delete review.");
        } finally {
            setDeletingId(null);
        }
    }, []);

    return {
        reviews,
        isLoading,
        deletingId,
        error,
        refetch,
        remove,
    };
}
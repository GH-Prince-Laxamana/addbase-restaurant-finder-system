import { useCallback, useState } from "react";
import { deleteAdminReview, getAdminReviews } from "../services/admin.service";
import { useResource } from "./useResource";
export function useAdminReviews() {
    const resource = useResource("reviews", getAdminReviews);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { update, refetch } = resource;
    const remove = useCallback(async (reviewId: string) => {
        setDeletingId(reviewId);
        try {
            await deleteAdminReview(reviewId);
            update(reviews => reviews.filter(review => review._id !== reviewId));
            refetch();
        } catch (error) { throw error instanceof Error ? error : new Error("Unable to delete review."); }
        finally { setDeletingId(null); }
    }, [update, refetch]);
    return { ...resource, reviews: resource.data ?? [], deletingId, remove };
}

import { ReviewSkeletons } from "../../components/LoadingSkeletons";
import { buttonStyles } from "../../components/ui/styles";
import { StarRating } from "../../components/StarRating";
import { useConfirmation } from "../../hooks/useConfirmation";
import { invalidateRestaurantReviews } from "../../hooks/useRestaurantReviews";
import { refreshRestaurantCards } from "../../utils/restaurantCache";
import { useState } from "react";
import { useAdminReviews } from "../../hooks/useAdminReviews";

export function AdminReviewsPage() {
    const { confirm, confirmation } = useConfirmation();
    const {
        reviews,
        isLoading,
        showSkeletons,
        deletingId,
        error,
        refetch,
        remove,
    } = useAdminReviews();

    const [actionError, setActionError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    async function handleDelete(reviewId: string) {
        const confirmed = await confirm(
            "Permanently delete this review? This cannot be undone.",
            "Delete review"
        );

        if (!confirmed) return;

        setActionError("");
        setActionMessage("");

        try {
            const restaurantId = reviews.find(review => review._id === reviewId)?.restaurant?._id;
            await remove(reviewId);
            invalidateRestaurantReviews();
            await refreshRestaurantCards(restaurantId);
            setActionMessage("Review deleted successfully.");
        } catch (err) {
            setActionError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete review."
            );
        }
    }

    return (
        <main data-scroll-ready={!showSkeletons} className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
            {confirmation}
            <header className="mb-8">
                <p className="text-sm font-medium text-neutral-500">
                    Administration
                </p>
                <h1 className="mt-2 text-[clamp(2.2rem,3.7vw,3.4rem)] font-medium">
                    Review moderation
                </h1>
                <p className="mt-2 text-neutral-600">
                    Review user feedback and remove inappropriate content.
                </p>
            </header>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-600">
                    {reviews.length} reviews loaded
                </p>

                <button
                    type="button"
                    onClick={refetch}
                    disabled={isLoading}
                    className={buttonStyles("secondary", "disabled:opacity-50")}
                >
                    Refresh reviews
                </button>
            </div>

            {actionMessage && (
                <p role="status" className="mb-4 text-sm text-green-700">
                    {actionMessage}
                </p>
            )}

            {actionError && (
                <p role="alert" className="mb-4 text-sm text-red-700">
                    {actionError}
                </p>
            )}

            {showSkeletons ? (
                <ReviewSkeletons moderation />
            ) : error ? (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 p-5"
                >
                    <p className="text-red-700">
                        Unable to load reviews: {error.message}
                    </p>
                    <button
                        type="button"
                        onClick={refetch}
                        className="mt-3 text-sm underline underline-offset-4"
                    >
                        Try again
                    </button>
                </div>
            ) : reviews.length === 0 ? (
                <div className="p-10 text-center">
                    <h2 className="text-lg font-semibold">
                        No reviews found
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        User reviews will appear here when they are submitted.
                    </p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {reviews.map((review) => (
                        <li
                            key={review._id}
                            className="rounded-[18px] border border-neutral-200 bg-surface p-7 [&_h2]:font-sans [&_h2]:text-base [&_h2]:font-semibold p-5"
                        >
                            <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-semibold">
                                            {review.restaurant?.name ?? "Deleted restaurant"}
                                        </h2>
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs">
                                            <StarRating value={review.score} />
                                        </span>
                                    </div>

                                    <p className="mt-1 text-xs text-neutral-500">
                                        Restaurant ID: {review.restaurant?.restaurantId ?? "Unavailable"}
                                    </p>

                                    <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-800">
                                        {review.comment}
                                    </p>

                                    <div className="mt-4 space-y-1 text-xs text-neutral-500">
                                        <p>
                                            Reviewer: {review.user?.name ?? "Deleted user"}
                                        </p>
                                        <p>
                                            Email: {review.user?.email ?? "Unavailable"}
                                        </p>
                                        <p>
                                            Submitted:{" "}
                                            {new Date(
                                                review.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="sm:shrink-0">
                                    <button
                                        type="button"
                                        disabled={deletingId === review._id}
                                        onClick={() => {
                                            void handleDelete(review._id);
                                        }}
                                        className={buttonStyles("danger", "disabled:opacity-50")}
                                    >
                                        {deletingId === review._id
                                            ? "Deleting..."
                                            : "Delete review"}
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
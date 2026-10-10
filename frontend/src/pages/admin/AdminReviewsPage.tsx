import { useState } from "react";
import { useAdminReviews } from "../../hooks/useAdminReviews";

export function AdminReviewsPage() {
    const {
        reviews,
        isLoading,
        deletingId,
        error,
        refetch,
        remove,
    } = useAdminReviews();

    const [actionError, setActionError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    async function handleDelete(reviewId: string) {
        const confirmed = window.confirm(
            "Permanently delete this review? This cannot be undone."
        );

        if (!confirmed) return;

        setActionError("");
        setActionMessage("");

        try {
            await remove(reviewId);
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
        <main className="mx-auto max-w-7xl px-6 py-10">
            <header className="mb-8">
                <p className="text-sm font-medium text-neutral-500">
                    Administration
                </p>
                <h1 className="mt-2 text-3xl font-bold">
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
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm disabled:opacity-50"
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

            {isLoading ? (
                <p role="status" className="py-10 text-center">
                    Loading reviews...
                </p>
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
                <div className="rounded-xl border border-neutral-200 p-10 text-center">
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
                            className="rounded-xl border border-neutral-200 p-5"
                        >
                            <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-semibold">
                                            {review.restaurant.name}
                                        </h2>
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs">
                                            {review.score} / 5
                                        </span>
                                    </div>

                                    <p className="mt-1 text-xs text-neutral-500">
                                        Restaurant ID: {review.restaurant.restaurantId}
                                    </p>

                                    <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-800">
                                        {review.comment}
                                    </p>

                                    <div className="mt-4 space-y-1 text-xs text-neutral-500">
                                        <p>
                                            Reviewer: {review.user.name}
                                        </p>
                                        <p>
                                            Email: {review.user.email}
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
                                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
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
import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRestaurant } from "../../hooks/useRestaurant";
import { useRestaurantReviews } from "../../hooks/useRestaurantReviews";

export function RestaurantDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: restaurant, isLoading, error, refetch } =
        useRestaurant(id);

    const { user } = useAuth();

    const {
        reviews,
        isLoading: isReviewsLoading,
        isMutating,
        error: reviewsError,
        create,
        update,
        remove,
    } = useRestaurantReviews(id);

    const [score, setScore] = useState("5");
    const [comment, setComment] = useState("");

    const [reviewMessage, setReviewMessage] = useState("");
    const [reviewError, setReviewError] = useState("");

    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editScore, setEditScore] = useState("5");
    const [editComment, setEditComment] = useState("");

    const [reviewActionMessage, setReviewActionMessage] = useState("");
    const [reviewActionError, setReviewActionError] = useState("");

    async function handleReviewSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setReviewMessage("");
        setReviewError("");

        try {
            await create({
                score: Number(score),
                comment: comment.trim(),
            });

            setComment("");
            setScore("5");
            setReviewMessage("Your review was submitted.");

            refetch();
        } catch (error) {
            setReviewError(
                error instanceof Error
                    ? error.message
                    : "Unable to submit your review."
            );
        }
    }

    async function handleReviewUpdate(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!editingReviewId) return;

        setReviewActionMessage("");
        setReviewActionError("");

        try {
            await update(editingReviewId, {
                score: Number(editScore),
                comment: editComment.trim(),
            });

            setEditingReviewId(null);
            setEditComment("");
            setEditScore("5");
            setReviewActionMessage("Your review was updated.");

            refetch();
        } catch (error) {
            setReviewActionError(
                error instanceof Error
                    ? error.message
                    : "Unable to update your review."
            );
        }
    }

    async function handleReviewDelete(reviewId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete your review?"
        );

        if (!confirmed) return;

        setReviewActionMessage("");
        setReviewActionError("");

        try {
            await remove(reviewId);

            if (editingReviewId === reviewId) {
                setEditingReviewId(null);
            }

            setReviewActionMessage("Your review was deleted.");

            refetch();
        } catch (error) {
            setReviewActionError(
                error instanceof Error
                    ? error.message
                    : "Unable to delete your review."
            );
        }
    }

    if (isLoading) {
        return (
            <main className="mx-auto max-w-4xl px-6 py-12">
                <p role="status">Loading restaurant...</p>
            </main>
        );
    }

    if (error || !restaurant) {
        return (
            <main className="mx-auto max-w-4xl px-6 py-12">
                <h1 className="text-2xl font-bold">
                    Restaurant unavailable
                </h1>
                <p role="alert" className="mt-3 text-neutral-600">
                    {error?.message ?? "Restaurant not found."}
                </p>
                <div className="mt-5 flex gap-4">
                    <button
                        type="button"
                        onClick={refetch}
                        className="underline underline-offset-4"
                    >
                        Try again
                    </button>
                    <Link
                        to="/restaurants"
                        className="underline underline-offset-4"
                    >
                        Back to restaurants
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-4xl px-6 py-12">
            <Link
                to="/restaurants"
                className="text-sm text-neutral-600 underline underline-offset-4"
            >
                ← Back to restaurants
            </Link>

            <header className="mt-8 border-b border-neutral-200 pb-8">
                <p className="text-sm text-neutral-500">
                    {restaurant.cuisine} · {restaurant.borough}
                </p>

                <h1 className="mt-3 text-3xl font-bold">
                    {restaurant.name}
                </h1>

                <p className="mt-4 text-neutral-600">
                    {restaurant.address.building
                        ? `${restaurant.address.building} `
                        : ""}
                    {restaurant.address.street},{" "}
                    {restaurant.address.zipcode}
                </p>

                <div className="mt-6 flex flex-wrap gap-6">
                    <div>
                        <p className="text-sm text-neutral-500">
                            Average rating
                        </p>
                        <p className="mt-1 text-xl font-semibold">
                            {Number(restaurant.avgScore).toFixed(1)} / 5
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-neutral-500">
                            User reviews
                        </p>
                        <p className="mt-1 text-xl font-semibold">
                            {restaurant.scoreCount}
                        </p>
                    </div>
                </div>
            </header>

            <section className="mt-10">
                <h2 className="text-xl font-bold">Reviews</h2>

                {user ? (
                    <form
                        onSubmit={handleReviewSubmit}
                        className="mt-5 space-y-4 rounded-xl border border-neutral-200 p-5"
                    >
                        <h3 className="font-semibold">Write a review</h3>

                        <label className="block text-sm">
                            <span className="mb-1 block">Rating</span>
                            <select
                                value={score}
                                onChange={(event) => setScore(event.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                            >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Good</option>
                                <option value="3">3 - Average</option>
                                <option value="2">2 - Poor</option>
                                <option value="1">1 - Very poor</option>
                            </select>
                        </label>

                        <label className="block text-sm">
                            <span className="mb-1 block">Comment</span>
                            <textarea
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                                maxLength={1000}
                                required
                                rows={4}
                                placeholder="Share your experience..."
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
                            />
                        </label>

                        {reviewError && (
                            <p role="alert" className="text-sm text-red-700">
                                {reviewError}
                            </p>
                        )}

                        {reviewMessage && (
                            <p role="status" className="text-sm text-green-700">
                                {reviewMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isMutating || !comment.trim()}
                            className="rounded-lg bg-neutral-950 px-5 py-3 font-medium text-white disabled:opacity-50"
                        >
                            {isMutating ? "Submitting..." : "Submit review"}
                        </button>
                    </form>
                ) : (
                    <p className="mt-4 text-neutral-600">
                        <Link
                            to="/login"
                            className="font-medium underline underline-offset-4"
                        >
                            Sign in
                        </Link>{" "}
                        to leave a review.
                    </p>
                )}

                {reviewActionMessage && (
                    <p role="status" className="mt-4 text-sm text-green-700">
                        {reviewActionMessage}
                    </p>
                )}

                {reviewActionError && (
                    <p role="alert" className="mt-4 text-sm text-red-700">
                        {reviewActionError}
                    </p>
                )}

                {isReviewsLoading ? (
                    <p role="status" className="mt-5">Loading reviews...</p>
                ) : reviewsError ? (
                    <p role="alert" className="mt-5 text-red-700">
                        Unable to load reviews: {reviewsError.message}
                    </p>
                ) : reviews.length === 0 ? (
                    <p className="mt-5 text-neutral-600">
                        No user reviews yet. Be the first to review this restaurant.
                    </p>
                ) : (
                    <ul className="mt-5 divide-y divide-neutral-200">
                        {reviews.map((review) => {
                            const reviewUserId =
                                typeof review.user === "object"
                                    ? review.user._id
                                    : review.user;

                            const isOwnReview = user?.id === reviewUserId;

                            return (
                                <li key={review._id} className="py-5">
                                    <div className="flex flex-wrap justify-between gap-2">
                                        <p className="font-semibold">
                                            {typeof review.user === "object"
                                                ? review.user.name
                                                : "Restaurant Explorer user"}
                                        </p>
                                        <p className="text-sm text-neutral-600">
                                            {review.score} / 5
                                        </p>
                                    </div>

                                    <p className="mt-3 whitespace-pre-wrap text-neutral-700">
                                        {review.comment}
                                    </p>

                                    <p className="mt-3 text-xs text-neutral-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                    {isOwnReview && (
                                        <div className="mt-3 flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingReviewId(review._id);
                                                    setEditScore(String(review.score));
                                                    setEditComment(review.comment);
                                                    setReviewActionError("");
                                                    setReviewActionMessage("");
                                                }}
                                                className="text-sm font-medium underline underline-offset-4"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                disabled={isMutating}
                                                onClick={() => {
                                                    void handleReviewDelete(review._id);
                                                }}
                                                className="text-sm font-medium text-red-700 underline underline-offset-4 disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}

                                    {editingReviewId === review._id && (
                                        <form
                                            onSubmit={handleReviewUpdate}
                                            className="mt-4 space-y-3 rounded-lg border border-neutral-200 p-4"
                                        >
                                            <label className="block text-sm">
                                                <span className="mb-1 block">Rating</span>
                                                <select
                                                    value={editScore}
                                                    onChange={(event) =>
                                                        setEditScore(event.target.value)
                                                    }
                                                    className="w-full rounded-lg border px-3 py-2"
                                                >
                                                    {[5, 4, 3, 2, 1].map((value) => (
                                                        <option key={value} value={value}>
                                                            {value} / 5
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label className="block text-sm">
                                                <span className="mb-1 block">Comment</span>
                                                <textarea
                                                    value={editComment}
                                                    onChange={(event) =>
                                                        setEditComment(event.target.value)
                                                    }
                                                    required
                                                    maxLength={1000}
                                                    rows={3}
                                                    className="w-full rounded-lg border px-3 py-2"
                                                />
                                            </label>

                                            <div className="flex gap-3">
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        isMutating || !editComment.trim()
                                                    }
                                                    className="rounded-lg bg-neutral-950 px-4 py-2 text-sm text-white disabled:opacity-50"
                                                >
                                                    {isMutating ? "Saving..." : "Save changes"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setEditingReviewId(null)}
                                                    className="rounded-lg border px-4 py-2 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </main>
    );
}
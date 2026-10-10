import { DetailSkeleton, ReviewSkeletons } from "../../components/LoadingSkeletons";
import { buttonStyles, fieldStyles } from "../../components/ui/styles";
import { StarRating, StarRatingInput } from "../../components/StarRating";
import { Modal } from "../../components/Modal";
import { useConfirmation } from "../../hooks/useConfirmation";
import { useState, type FormEvent } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { RevealHeading } from "../../components/RevealHeading";
import { getRestaurantImage } from "../../utils/restaurantImages";
import { useAuth } from "../../hooks/useAuth";
import { useRestaurant } from "../../hooks/useRestaurant";
import { useRestaurantReviews } from "../../hooks/useRestaurantReviews";
import { RestaurantFavoriteButton } from "../../components/RestaurantFavoriteButton";

export function RestaurantDetailPage() {
    const { confirm, confirmation } = useConfirmation();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const listLocation = (location.state as { listLocation?: { pathname: string; search: string } } | null)?.listLocation;
    const returnPath = listLocation && ["/restaurants", "/favorites", "/"].includes(listLocation.pathname) ? `${listLocation.pathname}${listLocation.search}` : "/restaurants";
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

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [score, setScore] = useState("0");
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
        if (Number(score) < 1 || Number(score) > 5) {
            setReviewError("Select a star rating before submitting your review.");
            return;
        }

        try {
            await create({
                score: Number(score),
                comment: comment.trim(),
            });

            setComment("");
            setScore("0");
            setReviewMessage("Your review was submitted.");
            setShowReviewForm(false);

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
        const confirmed = await confirm(
            "Are you sure you want to delete your review?",
            "Delete review"
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

    if (isLoading && !restaurant) return <DetailSkeleton />;

    if (error || !restaurant) {
        return (
            <main className="mx-auto max-w-4xl px-6 py-12">
                <h1 className="text-2xl font-medium">
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
        <main data-scroll-ready={!isReviewsLoading} className="mx-auto max-w-4xl px-6 py-12">
            {confirmation}
            <Link
                to={returnPath}
                onClick={event => { if (listLocation && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); navigate(-1); } }}
                className="text-sm text-neutral-600 underline underline-offset-4"
            >
                Back to restaurants
            </Link>

            <div className="relative mt-[30px] h-[280px] overflow-hidden rounded-[20px] md:h-[400px] md:rounded-3xl"><img className="size-full object-cover" src={getRestaurantImage(restaurant._id)} alt={`${restaurant.cuisine} restaurant inspiration`} /><span className="absolute bottom-[25px] left-[25px] rounded-full bg-background/95 px-[18px] py-2.5 font-display text-[1.1rem]">Discover something delicious</span></div>
            <p className="mt-[26px] text-center text-[.68rem] text-neutral-500">Photography is for inspiration and may not depict this restaurant.</p>
            <header className="mt-8 border-b border-neutral-200 pb-8">
                <p className="text-sm text-neutral-500">
                    {restaurant.cuisine} · {restaurant.borough}
                </p>

                <h1 className="mt-3 text-[clamp(2.5rem,4vw,3.6rem)] font-medium">
                    {restaurant.name}
                </h1>

                <p className="mt-4 text-neutral-600">
                    {restaurant.address.building
                        ? `${restaurant.address.building} `
                        : ""}
                    {restaurant.address.street},{" "}
                    {restaurant.address.zipcode}
                </p>

                {user?.role === "user" && (
                    <RestaurantFavoriteButton restaurantId={restaurant._id} />
                )}

                {!user && (
                    <p className="mt-5 text-sm text-neutral-600">
                        <Link
                            to="/login"
                            className="font-medium underline underline-offset-4"
                        >
                            Sign in
                        </Link>{" "}
                        to save this restaurant to your favorites.
                    </p>
                )}

                <div className="mt-6 flex flex-wrap gap-6">
                    <div>
                        <p className="text-sm text-neutral-500">
                            Average rating
                        </p>
                        <p className="mt-1 text-xl font-semibold">
                            <StarRating value={Number(restaurant.avgScore)} showValue unrated={restaurant.scoreCount === 0} />
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
                <RevealHeading><h2 className="flex items-baseline gap-3 text-xl font-medium">Reviews <span className="font-sans text-[.85rem] font-medium text-neutral-600">{restaurant.scoreCount}</span></h2></RevealHeading>

                {user ? (
                    <>
                        <button type="button" className={buttonStyles("primary", "mt-5")} onClick={() => { setReviewError(""); setShowReviewForm(true); }}>Write a review</button>
                        {showReviewForm && <Modal title="Write a review" busy={isMutating} onClose={() => setShowReviewForm(false)}>
                            <form
                                onSubmit={handleReviewSubmit}
                                className="space-y-4"
                            >


                                <StarRatingInput value={Number(score)} onChange={value => setScore(String(value))} disabled={isMutating} autoFocus />

                                <label className="block text-sm">
                                    <span className="mb-1 block">Comment</span>
                                    <textarea
                                        value={comment}
                                        onChange={(event) => setComment(event.target.value)}
                                        maxLength={1000}
                                        required
                                        rows={4}
                                        placeholder="Share your experience..."
                                        className={`${fieldStyles} resize-y`}
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
                                    disabled={isMutating || Number(score) < 1 || !comment.trim()}
                                    className={buttonStyles("primary", "disabled:opacity-50")}
                                >
                                    {isMutating ? "Submitting..." : "Submit review"}
                                </button>
                            </form></Modal>}
                    </>
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

                {reviewMessage && !showReviewForm && <p role="status" className="mt-4 text-sm text-green-700">{reviewMessage}</p>}
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
                    <ReviewSkeletons />
                ) : reviewsError ? (
                    <p role="alert" className="mt-5 text-red-700">
                        Unable to load reviews: {reviewsError.message}
                    </p>
                ) : reviews.length === 0 ? (
                    <p className="mt-5 text-neutral-600">
                        No user reviews yet. Be the first to review this restaurant.
                    </p>
                ) : (
                    <ul className="mt-[30px]">
                        {reviews.map((review) => {
                            const reviewUserId =
                                review.user && typeof review.user === "object"
                                    ? review.user._id
                                    : review.user;

                            const isOwnReview = user?.id === reviewUserId;

                            return (
                                <li key={review._id} className="border-t border-neutral-200 py-7">
                                    <div className="flex flex-wrap items-center gap-2.5 min-[481px]:flex-nowrap min-[481px]:gap-[14px]">
                                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-neutral-100 text-[.75rem] font-semibold text-neutral-700" aria-hidden="true">{(review.user && typeof review.user === "object"
                                            ? review.user.name
                                            : "Diner").trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase()}</span>
                                        <div className="min-w-0 flex-1 max-[480px]:basis-[calc(100%-54px)]"><p className="flex flex-wrap items-baseline gap-3 text-[.9rem] font-semibold">{review.user && typeof review.user === "object"
                                            ? review.user.name
                                            : "Hapag diner"}{isOwnReview && <span className="text-[.68rem] font-medium text-burgundy">Your review</span>}</p><time className="mt-[3px] block text-[.72rem] text-neutral-600" dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</time></div>
                                        <span className="self-start pt-[5px] max-[480px]:ml-[54px]"><StarRating value={review.score} /></span>
                                    </div>
                                    <p className="mt-5 mb-2.5 max-w-[70ch] whitespace-pre-wrap text-[.9rem] leading-[1.9] text-neutral-800 [overflow-wrap:anywhere] md:ml-[58px]">{review.comment}</p>
                                    {isOwnReview && (
                                        <div className="md:ml-[58px] [&_button]:min-h-10 [&_button]:py-1 mt-3 flex gap-4">
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
                                        <Modal title="Edit your review" busy={isMutating} onClose={() => setEditingReviewId(null)}>
                                            <form
                                                onSubmit={handleReviewUpdate}
                                                className="space-y-4"
                                            >
                                                <StarRatingInput value={Number(editScore)} onChange={value => setEditScore(String(value))} disabled={isMutating} autoFocus />

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
                                                        className={`${fieldStyles} resize-y`}
                                                    />
                                                </label>

                                                {reviewActionError && <p role="alert" className="text-red-700">{reviewActionError}</p>}
                                                <div className="flex gap-3">
                                                    <button
                                                        type="submit"
                                                        disabled={
                                                            isMutating || !editComment.trim()
                                                        }
                                                        className={buttonStyles("primary", "disabled:opacity-50")}
                                                    >
                                                        {isMutating ? "Saving..." : "Save changes"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={isMutating}
                                                        onClick={() => setEditingReviewId(null)}
                                                        className={buttonStyles("secondary")}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </Modal>
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

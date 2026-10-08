import {
  deleteReviewById,
  findAllReviews,
  findReviewById,
} from "../repositories/adminReview.repository.js";
import { recalculateRestaurantRating } from "../repositories/review.repository.js";

export async function getAllReviews() {
  return findAllReviews();
}

export async function removeReviewByAdmin(reviewId) {
  const review = await findReviewById(reviewId);

  if (!review) {
    const error = new Error("Review not found.");
    error.statusCode = 404;
    error.code = "REVIEW_NOT_FOUND";
    throw error;
  }

  const restaurantId = review.restaurant;

  await deleteReviewById(reviewId);

  await recalculateRestaurantRating(restaurantId);
}

import Restaurant from "../models/Restaurant.js";
import {
  createReview,
  deleteReviewById,
  findReviewById,
  findReviewsByRestaurant,
  recalculateRestaurantRating,
  updateReviewById,
} from "../repositories/review.repository.js";

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
}

export async function getRestaurantReviews(restaurantId) {
  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    isActive: true,
  });

  if (!restaurant) {
    const error = new Error("Restaurant not found.");
    error.statusCode = 404;
    error.code = "RESTAURANT_NOT_FOUND";
    throw error;
  }

  return findReviewsByRestaurant(restaurantId);
}

export async function addReview({ restaurantId, userId, score, comment }) {
  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    isActive: true,
  });

  if (!restaurant) {
    const error = new Error("Restaurant not found.");
    error.statusCode = 404;
    error.code = "RESTAURANT_NOT_FOUND";
    throw error;
  }

  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw validationError("Score must be a whole number from 1 to 5.");
  }

  if (
    typeof comment !== "string" ||
    !comment.trim() ||
    comment.trim().length > 1000
  ) {
    throw validationError(
      "Comment is required and must not exceed 1000 characters.",
    );
  }

  try {
    const review = await createReview({
      restaurantId,
      userId,
      score,
      comment: comment.trim(),
    });

    await recalculateRestaurantRating(restaurantId);

    return review;
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error(
        "You have already reviewed this restaurant.",
      );

      duplicateError.statusCode = 409;
      duplicateError.code = "REVIEW_ALREADY_EXISTS";

      throw duplicateError;
    }

    throw error;
  }
}

export async function editReview({ reviewId, userId, score, comment }) {
  const existingReview = await findReviewById(reviewId);

  if (!existingReview) {
    const error = new Error("Review not found.");
    error.statusCode = 404;
    error.code = "REVIEW_NOT_FOUND";
    throw error;
  }

  if (existingReview.user.toString() !== userId) {
    const error = new Error("You can only modify your own review.");

    error.statusCode = 403;
    error.code = "REVIEW_OWNERSHIP_REQUIRED";

    throw error;
  }

  const updates = {};

  if (score !== undefined) {
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw validationError("Score must be a whole number from 1 to 5.");
    }

    updates.score = score;
  }

  if (comment !== undefined) {
    if (
      typeof comment !== "string" ||
      !comment.trim() ||
      comment.trim().length > 1000
    ) {
      throw validationError(
        "Comment is required and must not exceed 1000 characters.",
      );
    }

    updates.comment = comment.trim();
  }

  if (Object.keys(updates).length === 0) {
    throw validationError("At least one review field must be provided.");
  }

  const review = await updateReviewById(reviewId, userId, updates);

  await recalculateRestaurantRating(existingReview.restaurant);

  return review;
}

export async function removeReview({ reviewId, userId }) {
  const existingReview = await findReviewById(reviewId);

  if (!existingReview) {
    const error = new Error("Review not found.");
    error.statusCode = 404;
    error.code = "REVIEW_NOT_FOUND";
    throw error;
  }

  if (existingReview.user.toString() !== userId) {
    const error = new Error("You can only delete your own review.");

    error.statusCode = 403;
    error.code = "REVIEW_OWNERSHIP_REQUIRED";

    throw error;
  }

  await deleteReviewById(reviewId, userId);

  await recalculateRestaurantRating(existingReview.restaurant);
}

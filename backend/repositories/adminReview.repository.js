import Review from "../models/Review.js";

export async function findAllReviews() {
  return Review.find()
    .populate("user", "name email")
    .populate("restaurant", "name restaurantId")
    .sort({ createdAt: -1 });
}

export async function findReviewById(reviewId) {
  return Review.findById(reviewId);
}

export async function deleteReviewById(reviewId) {
  return Review.findByIdAndDelete(reviewId);
}

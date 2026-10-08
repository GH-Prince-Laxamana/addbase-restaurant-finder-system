import mongoose from "mongoose";
import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";

export async function createReview({ restaurantId, userId, score, comment }) {
  return Review.create({
    restaurant: restaurantId,
    user: userId,
    score,
    comment,
  });
}

export async function findReviewsByRestaurant(restaurantId) {
  return Review.find({
    restaurant: restaurantId,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });
}

export async function findReviewById(reviewId) {
  if (!mongoose.isValidObjectId(reviewId)) {
    return null;
  }

  return Review.findById(reviewId);
}

export async function updateReviewById(reviewId, userId, updates) {
  return Review.findOneAndUpdate(
    {
      _id: reviewId,
      user: userId,
    },
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function deleteReviewById(reviewId, userId) {
  return Review.findOneAndDelete({
    _id: reviewId,
    user: userId,
  });
}

export async function recalculateRestaurantRating(restaurantId) {
  const [aggregate] = await Review.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
      },
    },
    {
      $group: {
        _id: "$restaurant",
        avgScore: {
          $avg: "$score",
        },
        scoreCount: {
          $sum: 1,
        },
      },
    },
  ]);

  await Restaurant.findByIdAndUpdate(restaurantId, {
    $set: {
      avgScore: aggregate?.avgScore ?? 0,
      scoreCount: aggregate?.scoreCount ?? 0,
    },
  });
}

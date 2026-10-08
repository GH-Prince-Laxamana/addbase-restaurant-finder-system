import {
  addReview,
  editReview,
  getRestaurantReviews,
  removeReview,
} from "../services/review.service.js";

export async function listReviews(req, res) {
  const reviews = await getRestaurantReviews(req.params.id);

  res.json({
    reviews,
  });
}

export async function createReview(req, res) {
  const review = await addReview({
    restaurantId: req.params.id,
    userId: req.user.id,
    score: req.body.score,
    comment: req.body.comment,
  });

  res.status(201).json({
    review,
  });
}

export async function updateReview(req, res) {
  const review = await editReview({
    reviewId: req.params.id,
    userId: req.user.id,
    score: req.body.score,
    comment: req.body.comment,
  });

  res.json({
    review,
  });
}

export async function deleteReview(req, res) {
  await removeReview({
    reviewId: req.params.id,
    userId: req.user.id,
  });

  res.status(204).send();
}

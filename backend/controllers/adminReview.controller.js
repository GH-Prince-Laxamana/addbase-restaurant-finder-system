import {
  getAllReviews,
  removeReviewByAdmin,
} from "../services/adminReview.service.js";

export async function listAdminReviews(req, res) {
  const reviews = await getAllReviews();

  res.json({
    reviews,
  });
}

export async function deleteAdminReview(req, res) {
  await removeReviewByAdmin(req.params.id);

  res.status(204).send();
}

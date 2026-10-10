import { Router } from "express";
import { listRestaurants } from "../controllers/restaurant.controller.js";
import { showRestaurant } from "../controllers/restaurantDetail.controller.js";
import { createReview, listReviews } from "../controllers/review.controller.js";
import { authenticate, limitWrites } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/security.middleware.js";
import {
  createFavorite,
  deleteFavorite,
} from "../controllers/favorite.controller.js";

const router = Router();
router.param("id", validateObjectId);

router.get("/", listRestaurants);
router.get("/:id", showRestaurant);
router.get("/:id/reviews", listReviews);
router.post("/:id/reviews", authenticate, limitWrites, createReview);
router.post("/:id/favorite", authenticate, limitWrites, createFavorite);
router.delete("/:id/favorite", authenticate, limitWrites, deleteFavorite);

export default router;

import { Router } from "express";
import { listRestaurants } from "../controllers/restaurant.controller.js";
import { showRestaurant } from "../controllers/restaurantDetail.controller.js";
import { createReview, listReviews } from "../controllers/review.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", listRestaurants);
router.get("/:id", showRestaurant);
router.get("/:id/reviews", listReviews);
router.post("/:id/reviews", authenticate, createReview);

export default router;

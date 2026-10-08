import { Router } from "express";
import authRouter from "./auth.routes.js";
import restaurantRouter from "./restaurant.routes.js";
import reviewRouter from "./review.routes.js";
import favoriteRouter from "./favorite.routes.js";
import adminRestaurantRouter from "./adminRestaurant.routes.js";
import adminReviewRouter from "./adminReview.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Restaurant Explorer API",
    version: "v1",
  });
});

router.use("/auth", authRouter);
router.use("/restaurants", restaurantRouter);
router.use("/reviews", reviewRouter);
router.use("/favorites", favoriteRouter);
router.use("/admin/restaurants", adminRestaurantRouter);
router.use("/admin/reviews", adminReviewRouter);

export default router;

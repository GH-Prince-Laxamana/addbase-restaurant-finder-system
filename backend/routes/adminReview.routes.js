import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import {
  deleteAdminReview,
  listAdminReviews,
} from "../controllers/adminReview.controller.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/", listAdminReviews);
router.delete("/:id", deleteAdminReview);

export default router;

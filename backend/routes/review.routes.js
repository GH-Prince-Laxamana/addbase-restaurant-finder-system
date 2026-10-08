import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  deleteReview,
  updateReview,
} from "../controllers/review.controller.js";

const router = Router();

router.patch("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);

export default router;

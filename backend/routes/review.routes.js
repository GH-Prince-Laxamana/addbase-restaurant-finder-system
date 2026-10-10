import { Router } from "express";
import { authenticate, limitWrites } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/security.middleware.js";
import {
  deleteReview,
  updateReview,
} from "../controllers/review.controller.js";

const router = Router();
router.param("id", validateObjectId);

router.patch("/:id", authenticate, limitWrites, updateReview);
router.delete("/:id", authenticate, limitWrites, deleteReview);

export default router;

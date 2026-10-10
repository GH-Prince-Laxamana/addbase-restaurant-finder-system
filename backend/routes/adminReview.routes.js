import { Router } from "express";
import {
  authenticate,
  requireAdmin,
  limitWrites,
} from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/security.middleware.js";
import {
  deleteAdminReview,
  listAdminReviews,
} from "../controllers/adminReview.controller.js";

const router = Router();

router.use(authenticate, requireAdmin, limitWrites);
router.param("id", validateObjectId);

router.get("/", listAdminReviews);
router.delete("/:id", deleteAdminReview);

export default router;

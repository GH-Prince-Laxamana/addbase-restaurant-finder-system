import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import {
  overviewStats,
  restaurantStats,
} from "../controllers/adminStats.controller.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/overview", overviewStats);
router.get("/restaurants", restaurantStats);

export default router;

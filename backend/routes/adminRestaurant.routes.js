import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import {
  createRestaurant,
  deleteRestaurant,
  permanentlyDeleteRestaurant,
  restoreRestaurant,
  updateRestaurant,
} from "../controllers/adminRestaurant.controller.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.post("/", createRestaurant);
router.patch("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);
router.patch("/:id/restore", restoreRestaurant);
router.delete("/:id/permanent", permanentlyDeleteRestaurant);

export default router;

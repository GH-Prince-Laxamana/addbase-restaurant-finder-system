import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import {
  createRestaurant,
  deleteRestaurant,
  permanentlyDeleteRestaurant,
  restoreRestaurant,
  updateRestaurant,
  listAdminRestaurants,
} from "../controllers/adminRestaurant.controller.js";
import {
  validateAdminRestaurantCreate,
  validateAdminRestaurantUpdate,
} from "../middleware/validate.middleware.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.post("/", validateAdminRestaurantCreate, createRestaurant);
router.patch("/:id", validateAdminRestaurantUpdate, updateRestaurant);
router.delete("/:id", deleteRestaurant);
router.patch("/:id/restore", restoreRestaurant);
router.delete("/:id/permanent", permanentlyDeleteRestaurant);
router.get("/", listAdminRestaurants);

export default router;

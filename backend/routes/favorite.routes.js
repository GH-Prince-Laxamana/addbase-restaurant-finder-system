import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { listFavorites } from "../controllers/favorite.controller.js";

const router = Router();

router.get("/", authenticate, listFavorites);

export default router;

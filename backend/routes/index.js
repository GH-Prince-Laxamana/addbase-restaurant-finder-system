import { Router } from "express";
import authRouter from "./auth.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Restaurant Explorer API",
    version: "v1",
  });
});

router.use("/auth", authRouter);

export default router;

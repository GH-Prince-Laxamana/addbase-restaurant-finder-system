import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Restaurant Explorer API",
    version: "v1",
  });
});

export default router;

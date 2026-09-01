import { Router } from "express";
import { getDashboard } from "../controllers/progressController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/dashboard", getDashboard);

export default router;

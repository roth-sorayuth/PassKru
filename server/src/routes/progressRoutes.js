import { Router } from "express";
import { getActivity, getDashboard } from "../controllers/progressController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/activity", getActivity);

export default router;

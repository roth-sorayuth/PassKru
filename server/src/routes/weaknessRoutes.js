import { Router } from "express";
import { getWeakAreas, getWeaknessSummary } from "../controllers/weaknessController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// A candidate's own weakness data — no admin gate needed, just auth.
router.use(protect);

router.get("/", getWeakAreas);
router.get("/summary", getWeaknessSummary);

export default router;

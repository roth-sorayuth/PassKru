import { Router } from "express";
import { startAttempt, submitAttempt, getAttempts, getAttempt } from "../controllers/attemptController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.post("/", startAttempt);
router.get("/", getAttempts);
router.post("/:attemptId/submit", submitAttempt);
router.get("/:attemptId", getAttempt);

export default router;

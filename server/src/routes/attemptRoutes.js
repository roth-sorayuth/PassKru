import { Router } from "express";
import { startAttempt, submitAttempt, getAttempts, getAttempt } from "../controllers/attemptController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Attempts belong to a signed-in candidate: without a valid token every route
// answers 401 instead of saving work under someone else or crashing.
router.post("/", protect, startAttempt);
router.post("/:attemptId/submit", protect, submitAttempt);
router.get("/:attemptId", protect, getAttempt);
router.get("/", protect, getAttempts);

export default router;

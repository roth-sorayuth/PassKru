import { Router } from "express";
import { startAttempt, submitAttempt, getAttempts, getAttempt } from "../controllers/attemptController.js";
import { optionalProtect, protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", optionalProtect, startAttempt);
router.post("/:attemptId/submit", optionalProtect, submitAttempt);
router.get("/:attemptId", optionalProtect, getAttempt);
router.get("/", protect, getAttempts);

export default router;

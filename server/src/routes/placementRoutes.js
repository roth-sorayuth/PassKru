import { Router } from "express";
import { getStatus, getPreview, start, saveAnswer, submit } from "../controllers/placementController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/status", getStatus);
router.get("/preview", getPreview);
router.post("/start", start);
router.put("/:attemptId/answers", saveAnswer);
router.post("/:attemptId/submit", submit);

export default router;

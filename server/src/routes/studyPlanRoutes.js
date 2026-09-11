import { Router } from "express";
import {
  getActivePlan,
  generatePlan,
  getPlanHistory,
  updateTaskStatus,
  getSubjectOptions,
  getTracks,
  getWeeklyReview,
  submitWeeklyReview,
  getWeeklyUpdate,
  decideWeeklyUpdate,
} from "../controllers/studyPlanController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// All study plan routes are user-specific and require authentication
router.use(protect);

router.get("/", getActivePlan);
router.get("/subject-options", getSubjectOptions);
router.get("/tracks", getTracks);
router.post("/generate", generatePlan);
router.get("/history", getPlanHistory);
router.get("/weekly-review", getWeeklyReview);
router.post("/weekly-review", submitWeeklyReview);
router.get("/weekly-update", getWeeklyUpdate);
router.post("/weekly-update/:updateId", decideWeeklyUpdate);
router.patch("/:planId/tasks/:taskId", updateTaskStatus);

export default router;

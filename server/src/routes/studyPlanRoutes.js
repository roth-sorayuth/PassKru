import { Router } from "express";
import {
  getActivePlan,
  generatePlan,
  getPlanHistory,
  updateTaskStatus,
  getSubjectOptions,
} from "../controllers/studyPlanController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// All study plan routes are user-specific and require authentication
router.use(protect);

router.get("/", getActivePlan);
router.get("/subject-options", getSubjectOptions);
router.post("/generate", generatePlan);
router.get("/history", getPlanHistory);
router.patch("/:planId/tasks/:taskId", updateTaskStatus);

export default router;

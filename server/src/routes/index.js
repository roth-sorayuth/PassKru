// import { Router } from "express";
// import authRoutes from "./authRoutes.js";

// const router = Router();

// router.use("/auth", authRoutes);

// export default router;

import { Router } from "express";
import authRoutes from "./authRoutes.js";
import { protect } from "../middlewares/authMiddleware.js"; 
import announcementRoutes from "./announcementRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import examRoutes from "./examRoutes.js";
import subjectRoutes from "./subjectRoutes.js";
import paperRoutes from "./paperRoutes.js";
import topicRoutes from "./topicRoutes.js";
import studyPlanRoutes from "./studyPlanRoutes.js";
import progressRoutes from "./progressRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/announcements", announcementRoutes);
router.use("/notifications", notificationRoutes);
router.use("/exams", examRoutes);
router.use("/subjects", subjectRoutes);
router.use("/papers", paperRoutes);
router.use("/topics", topicRoutes);
router.use("/study-plan", studyPlanRoutes);
router.use("/progress", progressRoutes);

// Protected: sync/create user in Supabase + return current user
router.get("/users/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
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
import userRoutes from "./userRoutes.js";
import quizRoutes from "./quizRoutes.js";
import mockExamRoutes from "./mockExamRoutes.js";
import attemptRoutes from "./attemptRoutes.js";
import mentorRoutes from "./mentorRoutes.js";

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
router.use("/quizzes", quizRoutes);
router.use("/mock-exams", mockExamRoutes);
router.use("/attempts", attemptRoutes);
router.use("/mentors", mentorRoutes);
router.use("/users", userRoutes);

// Protected: sync/create user in Supabase + return current user. Registered
// before the admin-only /users router below so /users/me is never swallowed
// by userRoutes' /:id handler (which requires admin and would otherwise treat
// "me" as an id).
router.get("/users/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.use("/users", userRoutes);

export default router;
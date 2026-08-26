import { Router } from "express";
import authRoutes from "./authRoutes.js";
import announcementRoutes from "./announcementRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import examRoutes from "./examRoutes.js";
import subjectRoutes from "./subjectRoutes.js";
import paperRoutes from "./paperRoutes.js";
import topicRoutes from "./topicRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/announcements", announcementRoutes);
router.use("/notifications", notificationRoutes);
router.use("/exams", examRoutes);
router.use("/subjects", subjectRoutes);
router.use("/papers", paperRoutes);
router.use("/topics", topicRoutes);

export default router;

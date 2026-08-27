import { Router } from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Apply protect middleware to all routes (users must be logged in to access their notifications)
router.use(protect);

router.route("/")
  .get(getNotifications);

router.route("/read-all")
  .put(markAllNotificationsRead);

router.route("/:id/read")
  .put(markNotificationRead);

router.route("/:id")
  .delete(deleteNotification);

export default router;

import { Router } from "express";
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// Apply protect middleware to all routes (users must be logged in to access announcements)
router.use(protect);

router.route("/")
  .get(getAnnouncements)
  .post(admin, createAnnouncement);

router.route("/:id")
  .get(getAnnouncementById)
  .put(admin, updateAnnouncement)
  .delete(admin, deleteAnnouncement);

export default router;

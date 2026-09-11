import { Router } from "express";
import {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  createBooking,
  updateMentorStatus,
} from "../controllers/mentorController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// GET is public so candidates & dashboard can list mentors (only approved
// ones by default — see mentorService.getAll; admin dashboard passes
// ?status=all or a specific status to see the moderation queue).
router.route("/")
  .get(getMentors)
  .post(protect, admin, createMentor);

router.route("/:id")
  .get(getMentorById)
  .put(protect, admin, updateMentor)
  .delete(protect, admin, deleteMentor);

// Candidate books their own session — protect only, no admin gate.
router.post("/:id/bookings", protect, createBooking);

router.patch("/:id/status", protect, admin, updateMentorStatus);

export default router;

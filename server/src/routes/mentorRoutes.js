import { Router } from "express";
import {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
} from "../controllers/mentorController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// GET is public so candidates & dashboard can list mentors
router.route("/")
  .get(getMentors)
  .post(protect, admin, createMentor);

router.route("/:id")
  .get(getMentorById)
  .put(protect, admin, updateMentor)
  .delete(protect, admin, deleteMentor);

export default router;

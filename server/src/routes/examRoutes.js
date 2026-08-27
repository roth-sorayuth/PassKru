import { Router } from "express";
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// Apply protect middleware to all routes (users must be logged in to view exams)
router.use(protect);

router.route("/")
  .get(getExams)
  .post(admin, createExam);

router.route("/:id")
  .get(getExamById)
  .put(admin, updateExam)
  .delete(admin, deleteExam);

export default router;

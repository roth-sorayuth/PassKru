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

// Allow public reading of exams, protect administrative operations
router.route("/")
  .get(getExams)
  .post(protect, admin, createExam);

router.route("/:id")
  .get(getExamById)
  .put(protect, admin, updateExam)
  .delete(protect, admin, deleteExam);

export default router;

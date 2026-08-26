import { Router } from "express";
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// Apply protect middleware to all routes (users must be logged in to view subjects)
router.use(protect);

router.route("/")
  .get(getSubjects)
  .post(admin, createSubject);

router.route("/:id")
  .get(getSubjectById)
  .put(admin, updateSubject)
  .delete(admin, deleteSubject);

export default router;

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

// NOTE (manage-upload branch): GET is open so adminDashboard can fetch subject list without auth.
// POST/PUT/DELETE still require auth. Restore GET protect before merging.
router.route("/")
  .get(getSubjects)
  .post(protect, admin, createSubject);

router.route("/:id")
  .get(getSubjectById)
  .put(protect, admin, updateSubject)
  .delete(protect, admin, deleteSubject);

export default router;

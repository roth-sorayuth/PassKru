import { Router } from "express";
import {
  getMockExams,
  getMockExam,
  createMockExam,
  updateMockExam,
  deleteMockExam,
  addSection,
  updateSection,
  deleteSection,
  setSectionQuestions,
} from "../controllers/mockExamController.js";
import { protect, optionalProtect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/")
  .get(optionalProtect, getMockExams)
  .post(protect, admin, createMockExam);

router.route("/:mockExamId")
  .get(optionalProtect, getMockExam)
  .put(protect, admin, updateMockExam)
  .delete(protect, admin, deleteMockExam);

// `protect` must run first: it reads the token and sets req.user, which `admin` checks.
router.post("/:mockExamId/sections", protect, admin, addSection);
router.put("/:mockExamId/sections/:sectionId", protect, admin, updateSection);
router.delete("/:mockExamId/sections/:sectionId", protect, admin, deleteSection);
router.put("/:mockExamId/sections/:sectionId/questions", protect, admin, setSectionQuestions);

export default router;

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

router.post("/:mockExamId/sections", admin, addSection);
router.put("/:mockExamId/sections/:sectionId", admin, updateSection);
router.delete("/:mockExamId/sections/:sectionId", admin, deleteSection);
router.put("/:mockExamId/sections/:sectionId/questions", admin, setSectionQuestions);

export default router;

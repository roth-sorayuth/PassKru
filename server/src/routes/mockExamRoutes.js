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
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.route("/")
  .get(getMockExams)
  .post(admin, createMockExam);

router.route("/:mockExamId")
  .get(getMockExam)
  .put(admin, updateMockExam)
  .delete(admin, deleteMockExam);

router.post("/:mockExamId/sections", admin, addSection);
router.put("/:mockExamId/sections/:sectionId", admin, updateSection);
router.delete("/:mockExamId/sections/:sectionId", admin, deleteSection);
router.put("/:mockExamId/sections/:sectionId/questions", admin, setSectionQuestions);

export default router;

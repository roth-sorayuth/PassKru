import { Router } from "express";
import { getMockExams, getMockExam } from "../controllers/mockExamController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", getMockExams);
router.get("/:mockExamId", getMockExam);

export default router;

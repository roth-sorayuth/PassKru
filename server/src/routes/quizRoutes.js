import { Router } from "express";
import { getQuizzes, getQuiz } from "../controllers/quizController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", getQuizzes);
router.get("/:quizId", getQuiz);

export default router;

import { Router } from "express";
import {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  setQuizQuestions,
} from "../controllers/quizController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.route("/")
  .get(getQuizzes)
  .post(admin, createQuiz);

router.route("/:quizId")
  .get(getQuiz)
  .put(admin, updateQuiz)
  .delete(admin, deleteQuiz);

router.put("/:quizId/questions", admin, setQuizQuestions);

export default router;

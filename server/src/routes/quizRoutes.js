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

// Quizzes and questions are readable by candidates for taking quizzes.
// Creating, updating, or deleting quizzes requires authentication and admin privileges.
router.route("/")
  .get(getQuizzes)
  .post(protect, admin, createQuiz);

router.route("/:quizId")
  .get(getQuiz)
  .put(protect, admin, updateQuiz)
  .delete(protect, admin, deleteQuiz);

router.put("/:quizId/questions", protect, admin, setQuizQuestions);

export default router;

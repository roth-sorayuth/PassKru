import { Router } from "express";
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// Question bank carries answer keys — admin-only end to end, like userRoutes.
router.use(protect, admin);

router.route("/")
  .get(getQuestions)
  .post(createQuestion);

router.route("/:id")
  .get(getQuestionById)
  .put(updateQuestion)
  .delete(deleteQuestion);

export default router;

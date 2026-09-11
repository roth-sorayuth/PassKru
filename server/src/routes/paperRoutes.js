import { Router } from "express";
import {
  getPapers,
  getPaperById,
  createPaper,
  updatePaper,
  deletePaper,
} from "../controllers/paperController.js";
// NOTE (manage-upload branch): auth removed for adminDashboard test dashboard.
// Restore protect + admin middleware before merging to main.
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/")
  .get(getPapers)
  .post(protect, admin, createPaper);

router.route("/:id")
  .get(getPaperById)
  .put(protect, admin, updatePaper)
  .delete(protect, admin, deletePaper);

export default router;

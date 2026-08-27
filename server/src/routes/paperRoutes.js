import { Router } from "express";
import {
  getPapers,
  getPaperById,
  createPaper,
  updatePaper,
  deletePaper,
} from "../controllers/paperController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// Apply protect middleware to all routes (users must be logged in to view past papers)
router.use(protect);

router.route("/")
  .get(getPapers)
  .post(admin, createPaper);

router.route("/:id")
  .get(getPaperById)
  .put(admin, updatePaper)
  .delete(admin, deletePaper);

export default router;

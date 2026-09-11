import { Router } from "express";
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/topicController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// Apply protect middleware to all routes (users must be logged in to view topics)
router.use(protect);

router.route("/")
  .get(getTopics)
  .post(admin, createTopic);

router.route("/:id")
  .get(getTopicById)
  .put(admin, updateTopic)
  .delete(admin, deleteTopic);

export default router;

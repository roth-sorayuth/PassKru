import { Router } from "express";
import {
  getUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "../controllers/userController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// Protect all user management routes - strictly admin only
router.use(protect, admin);

router.route("/")
  .get(getUsersHandler)
  .post(createUserHandler);

router.route("/:id")
  .get(getUserByIdHandler)
  .put(updateUserHandler)
  .delete(deleteUserHandler);

export default router;

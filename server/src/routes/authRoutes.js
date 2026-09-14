import { Router } from "express";
import { getMe, updateMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Sign-up and sign-in are handled by Clerk; `protect` creates the DB user on first request.
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);

export default router;

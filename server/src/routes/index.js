// import { Router } from "express";
// import authRoutes from "./authRoutes.js";

// const router = Router();

// router.use("/auth", authRoutes);

// export default router;

import { Router } from "express";
import authRoutes from "./authRoutes.js";
import { protect } from "../middlewares/authMiddleware.js"; 

const router = Router();

router.use("/auth", authRoutes);

// Protected: sync/create user in Supabase + return current user
router.get("/users/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
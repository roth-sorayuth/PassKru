import * as authService from "../services/authService.js";

export const getMe = async (req, res, next) => {
  try {
    // protect already populated req.user, but re-read with the exam relation
    // so the client can use targetExam.targetCode rather than mapping ids.
    const user = await authService.getUserWithExam(req.user.userId);
    return res.status(200).json({
      success: true,
      user: user || req.user,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/auth/me
export const updateMe = async (req, res, next) => {
  try {
    const user = await authService.updateOwnProfile(req.user.userId, req.body);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

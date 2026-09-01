import * as progressService from "../services/progressService.js";

// GET /api/progress/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const summary = await progressService.getDashboardSummary(req.user.userId);
    return res.status(200).json({ success: true, ...summary });
  } catch (error) {
    next(error);
  }
};

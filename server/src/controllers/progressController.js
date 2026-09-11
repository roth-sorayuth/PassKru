import * as progressService from "../services/progressService.js";
import { listActivity } from "../services/activityService.js";

// GET /api/progress/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const summary = await progressService.getDashboardSummary(req.user.userId);
    return res.status(200).json({ success: true, ...summary });
  } catch (error) {
    next(error);
  }
};

// GET /api/progress/activity?before=<ISO time>&limit=10
export const getActivity = async (req, res, next) => {
  try {
    const page = await listActivity(req.user.userId, { before: req.query.before, limit: req.query.limit });
    return res.status(200).json({ success: true, ...page });
  } catch (error) {
    next(error);
  }
};

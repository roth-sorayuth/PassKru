import * as weaknessService from "../services/weaknessService.js";

// GET /api/weakness — current user's weak areas, weakest first
export const getWeakAreas = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const weakAreas = await weaknessService.getWeakAreasForUser(userId);
    return res.status(200).json({ success: true, count: weakAreas.length, weakAreas });
  } catch (error) {
    next(error);
  }
};

// GET /api/weakness/summary — grouped by subject
export const getWeaknessSummary = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const summary = await weaknessService.getWeaknessSummaryForUser(userId);
    return res.status(200).json({ success: true, summary });
  } catch (error) {
    next(error);
  }
};

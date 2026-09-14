import * as weaknessService from "../services/weaknessService.js";

// GET /api/weakness — current user's weak and strong areas based on active study plan
export const getWeakAreas = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const analysis = await weaknessService.getWeaknessAnalysisForUser(userId);
    return res.status(200).json({
      success: true,
      hasActivePlan: analysis.hasActivePlan,
      plan: analysis.plan,
      count: analysis.weakAreas.length,
      weakAreas: analysis.weakAreas,
      strengths: analysis.strengths,
      summary: analysis.summary,
    });
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

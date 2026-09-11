import * as placementService from "../services/placementService.js";

// GET /api/placement/status
export const getStatus = async (req, res, next) => {
  try {
    const placement = await placementService.getPlacementStatus(req.user.userId, { withPreview: true });
    return res.status(200).json({ success: true, placement });
  } catch (error) {
    next(error);
  }
};

// GET /api/placement/preview — question split per subject for a new test
export const getPreview = async (req, res, next) => {
  try {
    const preview = await placementService.getPlacementPreview(req.user.userId);
    return res.status(200).json({ success: true, preview });
  } catch (error) {
    next(error);
  }
};

// POST /api/placement/start — starts a new test or resumes the open one
export const start = async (req, res, next) => {
  try {
    const session = await placementService.startPlacement(req.user.userId);
    return res.status(200).json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

// PUT /api/placement/:attemptId/answers — { questionId, selectedOptionId }
export const saveAnswer = async (req, res, next) => {
  try {
    const answer = await placementService.savePlacementAnswer(req.user.userId, req.params.attemptId, req.body || {});
    return res.status(200).json({ success: true, answer });
  } catch (error) {
    next(error);
  }
};

// POST /api/placement/:attemptId/submit
export const submit = async (req, res, next) => {
  try {
    const result = await placementService.submitPlacement(req.user.userId, req.params.attemptId);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

import * as attemptService from "../services/attemptService.js";

// POST /api/attempts
export const startAttempt = async (req, res, next) => {
  try {
    const { attemptType, quizId, mockExamId } = req.body;
    const attempt = await attemptService.startAttempt(req.user.userId, { attemptType, quizId, mockExamId });
    return res.status(201).json({ success: true, attempt });
  } catch (error) {
    next(error);
  }
};

// POST /api/attempts/:attemptId/submit
export const submitAttempt = async (req, res, next) => {
  try {
    const attemptId = parseInt(req.params.attemptId, 10);
    if (isNaN(attemptId)) {
      return res.status(400).json({ success: false, message: "Invalid attempt ID" });
    }

    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "'answers' must be an array" });
    }

    const result = await attemptService.submitAttempt(req.user.userId, attemptId, answers);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// GET /api/attempts
export const getAttempts = async (req, res, next) => {
  try {
    const attempts = await attemptService.listUserAttempts(req.user.userId);
    return res.status(200).json({ success: true, count: attempts.length, attempts });
  } catch (error) {
    next(error);
  }
};

// GET /api/attempts/:attemptId
export const getAttempt = async (req, res, next) => {
  try {
    const attemptId = parseInt(req.params.attemptId, 10);
    if (isNaN(attemptId)) {
      return res.status(400).json({ success: false, message: "Invalid attempt ID" });
    }
    const attempt = await attemptService.getAttemptResult(req.user.userId, attemptId);
    return res.status(200).json({ success: true, attempt });
  } catch (error) {
    next(error);
  }
};

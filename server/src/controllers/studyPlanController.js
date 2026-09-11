import * as studyPlanService from "../services/studyPlanService.js";
import { getSubjectOptionsForExamCode } from "../config/examSubjects.js";
import { getTrackAvailability, withContentCounts } from "../services/trackContentService.js";

// GET /api/study-plan/subject-options?targetExam=nie
// Drives the wizard's subject step so the selection rules (single major vs
// RTTC dual-major pairing vs generalist) live in one place server-side.
export const getSubjectOptions = async (req, res, next) => {
  try {
    const { targetExam } = req.query;
    if (!targetExam) {
      return res.status(400).json({ success: false, message: "Please provide targetExam" });
    }

    const rules = getSubjectOptionsForExamCode(targetExam);
    if (!rules) {
      return res.status(404).json({
        success: false,
        message: `No subject rules configured for exam "${targetExam}"`,
      });
    }

    // Each option carries how many questions / quizzes / papers exist for it.
    const options = await withContentCounts(targetExam, rules);
    return res.status(200).json({ success: true, targetExam, options });
  } catch (error) {
    next(error);
  }
};

// GET /api/study-plan/tracks
// Which exam tracks have content to study, for step 1 of the wizard.
export const getTracks = async (req, res, next) => {
  try {
    const tracks = await getTrackAvailability();
    return res.status(200).json({ success: true, tracks });
  } catch (error) {
    next(error);
  }
};

// GET /api/study-plan
export const getActivePlan = async (req, res, next) => {
  try {
    const plan = await studyPlanService.getActivePlanForUser(req.user.userId);
    return res.status(200).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

// POST /api/study-plan/generate
// Subjects come from the saved exam selection and the level from the latest
// placement test, so the only input is an optional daily goal.
export const generatePlan = async (req, res, next) => {
  try {
    const { dailyGoalMinutes } = req.body || {};
    if (dailyGoalMinutes !== undefined && !Number.isFinite(Number(dailyGoalMinutes))) {
      return res.status(400).json({ success: false, message: "'dailyGoalMinutes' must be a number" });
    }

    const plan = await studyPlanService.generatePlanForUser(req.user.userId, { dailyGoalMinutes });

    return res.status(201).json({
      success: true,
      message: "Study plan generated successfully",
      plan,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/study-plan/history
export const getPlanHistory = async (req, res, next) => {
  try {
    const plans = await studyPlanService.listPlansForUser(req.user.userId);
    return res.status(200).json({ success: true, count: plans.length, plans });
  } catch (error) {
    next(error);
  }
};

// GET /api/study-plan/weekly-review
export const getWeeklyReview = async (req, res, next) => {
  try {
    const review = await studyPlanService.getWeeklyReviewForUser(req.user.userId);
    return res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// POST /api/study-plan/weekly-review  { answers: [{ questionId, selectedOptionId }] }
export const submitWeeklyReview = async (req, res, next) => {
  try {
    const { answers } = req.body || {};
    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "'answers' must be an array" });
    }
    const result = await studyPlanService.submitWeeklyReviewForUser(req.user.userId, answers);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// GET /api/study-plan/weekly-update
export const getWeeklyUpdate = async (req, res, next) => {
  try {
    const update = await studyPlanService.getWeeklyUpdateForUser(req.user.userId);
    return res.status(200).json({ success: true, update });
  } catch (error) {
    next(error);
  }
};

// POST /api/study-plan/weekly-update/:updateId  { decision: "accept" | "keep" }
export const decideWeeklyUpdate = async (req, res, next) => {
  try {
    const { decision } = req.body || {};
    const update = await studyPlanService.decideWeeklyUpdateForUser(req.user.userId, req.params.updateId, decision);
    return res.status(200).json({ success: true, update });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/study-plan/:planId/tasks/:taskId
export const updateTaskStatus = async (req, res, next) => {
  try {
    const planId = parseInt(req.params.planId, 10);
    const { taskId } = req.params;
    const { completed } = req.body;

    if (isNaN(planId)) {
      return res.status(400).json({ success: false, message: "Invalid plan ID" });
    }
    if (typeof completed !== "boolean") {
      return res.status(400).json({ success: false, message: "'completed' must be a boolean" });
    }

    const plan = await studyPlanService.setTaskCompletion(req.user.userId, planId, taskId, completed);

    return res.status(200).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

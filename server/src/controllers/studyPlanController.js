import * as studyPlanService from "../services/studyPlanService.js";
import { getSubjectOptionsForExamCode } from "../config/examSubjects.js";

// GET /api/study-plan/subject-options?targetExam=nie
// Drives the wizard's subject step so the selection rules (single major vs
// RTTC dual-major pairing vs generalist) live in one place server-side.
export const getSubjectOptions = async (req, res, next) => {
  try {
    const { targetExam } = req.query;
    if (!targetExam) {
      return res.status(400).json({ success: false, message: "Please provide targetExam" });
    }

    const options = getSubjectOptionsForExamCode(targetExam);
    if (!options) {
      return res.status(404).json({
        success: false,
        message: `No subject rules configured for exam "${targetExam}"`,
      });
    }

    return res.status(200).json({ success: true, targetExam, options });
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
export const generatePlan = async (req, res, next) => {
  try {
    const { targetExam, targetSubject, targetSubjects, knowledgeLevel, dailyGoalMinutes, availableStudyHours, examDate, resetProgress } = req.body;

    if (targetSubjects !== undefined && !Array.isArray(targetSubjects)) {
      return res.status(400).json({ success: false, message: "'targetSubjects' must be an array" });
    }

    const plan = await studyPlanService.generatePlanForUser(req.user.userId, {
      targetExam,
      // Legacy single-string callers still work; the array wins when present.
      targetSubject,
      targetSubjects,
      knowledgeLevel,
      dailyGoalMinutes,
      availableStudyHours,
      examDate,
      resetProgress,
    });

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

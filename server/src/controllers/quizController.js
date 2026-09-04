import * as quizService from "../services/quizService.js";

// GET /api/quizzes?subjectId=&examId=
export const getQuizzes = async (req, res, next) => {
  try {
    const { subjectId, examId } = req.query;
    const quizzes = await quizService.listQuizzes({ subjectId, examId });
    return res.status(200).json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes/:quizId
export const getQuiz = async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId, 10);
    if (isNaN(quizId)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID" });
    }
    const quiz = await quizService.getQuizForTaking(quizId);
    return res.status(200).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// POST /api/quizzes
export const createQuiz = async (req, res, next) => {
  try {
    const { subjectId, title } = req.body;
    if (!subjectId || !title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Please provide subjectId and title" });
    }
    const quiz = await quizService.createQuiz(req.body);
    return res.status(201).json({ success: true, message: "Quiz created successfully", quiz });
  } catch (error) {
    next(error);
  }
};

// PUT /api/quizzes/:quizId
export const updateQuiz = async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId, 10);
    if (isNaN(quizId)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID" });
    }
    const quiz = await quizService.updateQuiz(quizId, req.body);
    return res.status(200).json({ success: true, message: "Quiz updated successfully", quiz });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/quizzes/:quizId
export const deleteQuiz = async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId, 10);
    if (isNaN(quizId)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID" });
    }
    await quizService.removeQuiz(quizId);
    return res.status(200).json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// PUT /api/quizzes/:quizId/questions  { questionIds: number[] }
export const setQuizQuestions = async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId, 10);
    if (isNaN(quizId)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID" });
    }
    const quiz = await quizService.setQuizQuestions(quizId, req.body.questionIds);
    return res.status(200).json({ success: true, message: "Quiz questions updated successfully", quiz });
  } catch (error) {
    next(error);
  }
};

import * as questionService from "../services/questionService.js";

// GET /api/questions?topicId=&subjectId=&questionType=&difficultyLevel=&search=
export const getQuestions = async (req, res, next) => {
  try {
    const { topicId, subjectId, questionType, difficultyLevel, search } = req.query;
    const questions = await questionService.listQuestions({
      topicId,
      subjectId,
      questionType,
      difficultyLevel,
      search,
    });
    return res.status(200).json({ success: true, count: questions.length, questions });
  } catch (error) {
    next(error);
  }
};

// GET /api/questions/:id
export const getQuestionById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid question ID" });
    }
    const question = await questionService.getQuestionById(id);
    return res.status(200).json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

// POST /api/questions
export const createQuestion = async (req, res, next) => {
  try {
    const { topicId, questionText, questionType } = req.body;
    if (!topicId || !questionText || !questionText.trim() || !questionType) {
      return res.status(400).json({
        success: false,
        message: "Please provide topicId, questionText, and questionType",
      });
    }
    const question = await questionService.createQuestion(req.body);
    return res.status(201).json({ success: true, message: "Question created successfully", question });
  } catch (error) {
    next(error);
  }
};

// PUT /api/questions/:id
export const updateQuestion = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid question ID" });
    }
    const question = await questionService.updateQuestion(id, req.body);
    return res.status(200).json({ success: true, message: "Question updated successfully", question });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/questions/:id
export const deleteQuestion = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid question ID" });
    }
    await questionService.removeQuestion(id);
    return res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};

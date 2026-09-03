import * as paperService from "../services/paperService.js";

// GET /api/papers
export const getPapers = async (req, res, next) => {
  try {
    const { examId, subjectId, year, hasAnswerKey, search, paperType } = req.query;
    const papers = await paperService.getAll({ examId, subjectId, year, hasAnswerKey, search, paperType });

    return res.status(200).json({
      success: true,
      count: papers.length,
      papers,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/papers/:id
export const getPaperById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid past paper ID",
      });
    }

    const paper = await paperService.getById(id);

    return res.status(200).json({
      success: true,
      paper,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/papers
export const createPaper = async (req, res, next) => {
  try {
    const { examId, subjectId, year, title, session, fileUrl, fileSize, hasAnswerKey, totalQuestions, paperType } = req.body;

    if (!subjectId || !title) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (subjectId, title)",
      });
    }

    const paper = await paperService.create({
      examId,
      subjectId,
      year,
      title,
      session,
      fileUrl,
      fileSize,
      hasAnswerKey,
      totalQuestions,
      paperType,
    });

    return res.status(201).json({
      success: true,
      message: "Past paper created successfully",
      paper,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/papers/:id
export const updatePaper = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid past paper ID",
      });
    }

    const { subjectId, year, title, session, fileUrl, fileSize, hasAnswerKey, totalQuestions, paperType } = req.body;

    const updatedPaper = await paperService.update(id, {
      subjectId,
      year,
      title,
      session,
      fileUrl,
      fileSize,
      hasAnswerKey,
      totalQuestions,
      paperType,
    });

    return res.status(200).json({
      success: true,
      message: "Past paper updated successfully",
      paper: updatedPaper,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/papers/:id
export const deletePaper = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid past paper ID",
      });
    }

    await paperService.remove(id);

    return res.status(200).json({
      success: true,
      message: "Past paper deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

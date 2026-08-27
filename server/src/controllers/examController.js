import * as examService from "../services/examService.js";

// GET /api/exams
export const getExams = async (req, res, next) => {
  try {
    const exams = await examService.getAll();

    return res.status(200).json({
      success: true,
      count: exams.length,
      exams,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/exams/:id
export const getExamById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    const exam = await examService.getById(id);

    return res.status(200).json({
      success: true,
      exam,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/exams
export const createExam = async (req, res, next) => {
  try {
    const { examName, examType, category, targetCode, description, schedules, requirements } = req.body;

    if (!examName) {
      return res.status(400).json({
        success: false,
        message: "Please provide the examName field",
      });
    }

    const exam = await examService.create({
      examName,
      examType,
      category,
      targetCode,
      description,
      schedules,
      requirements,
    });

    return res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/exams/:id
export const updateExam = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    const { examName, examType, category, targetCode, description, schedules, requirements } = req.body;

    const updatedExam = await examService.update(id, {
      examName,
      examType,
      category,
      targetCode,
      description,
      schedules,
      requirements,
    });

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      exam: updatedExam,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/exams/:id
export const deleteExam = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    await examService.remove(id);

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

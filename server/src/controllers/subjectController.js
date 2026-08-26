import * as subjectService from "../services/subjectService.js";

// GET /api/subjects
export const getSubjects = async (req, res, next) => {
  try {
    const { examId } = req.query;
    const subjects = await subjectService.getAll({ examId });

    return res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/subjects/:id
export const getSubjectById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    const subject = await subjectService.getById(id);

    return res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/subjects
export const createSubject = async (req, res, next) => {
  try {
    const { examId, subjectName, description } = req.body;

    if (!examId || !subjectName) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (examId, subjectName)",
      });
    }

    const subject = await subjectService.create({
      examId,
      subjectName,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subjects/:id
export const updateSubject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    const { examId, subjectName, description } = req.body;

    const updatedSubject = await subjectService.update(id, {
      examId,
      subjectName,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      subject: updatedSubject,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/subjects/:id
export const deleteSubject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    await subjectService.remove(id);

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

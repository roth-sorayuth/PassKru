import * as quizService from "../services/quizService.js";

// GET /api/mock-exams?examId=
export const getMockExams = async (req, res, next) => {
  try {
    const { examId } = req.query;
    const mockExams = await quizService.listMockExams({ examId });
    return res.status(200).json({ success: true, count: mockExams.length, mockExams });
  } catch (error) {
    next(error);
  }
};

// GET /api/mock-exams/:mockExamId
export const getMockExam = async (req, res, next) => {
  try {
    const mockExamId = parseInt(req.params.mockExamId, 10);
    if (isNaN(mockExamId)) {
      return res.status(400).json({ success: false, message: "Invalid mock exam ID" });
    }
    const mockExam = await quizService.getMockExamForTaking(mockExamId);
    return res.status(200).json({ success: true, mockExam });
  } catch (error) {
    next(error);
  }
};

// POST /api/mock-exams
export const createMockExam = async (req, res, next) => {
  try {
    const { examId, title } = req.body;
    if (!examId || !title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Please provide examId and title" });
    }
    const mockExam = await quizService.createMockExam(req.body);
    return res.status(201).json({ success: true, message: "Mock exam created successfully", mockExam });
  } catch (error) {
    next(error);
  }
};

// PUT /api/mock-exams/:mockExamId
export const updateMockExam = async (req, res, next) => {
  try {
    const mockExamId = parseInt(req.params.mockExamId, 10);
    if (isNaN(mockExamId)) {
      return res.status(400).json({ success: false, message: "Invalid mock exam ID" });
    }
    const mockExam = await quizService.updateMockExam(mockExamId, req.body);
    return res.status(200).json({ success: true, message: "Mock exam updated successfully", mockExam });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/mock-exams/:mockExamId
export const deleteMockExam = async (req, res, next) => {
  try {
    const mockExamId = parseInt(req.params.mockExamId, 10);
    if (isNaN(mockExamId)) {
      return res.status(400).json({ success: false, message: "Invalid mock exam ID" });
    }
    await quizService.removeMockExam(mockExamId);
    return res.status(200).json({ success: true, message: "Mock exam deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/mock-exams/:mockExamId/sections  { subjectId, numberOfQuestions }
export const addSection = async (req, res, next) => {
  try {
    const mockExamId = parseInt(req.params.mockExamId, 10);
    if (isNaN(mockExamId)) {
      return res.status(400).json({ success: false, message: "Invalid mock exam ID" });
    }
    if (!req.body.subjectId) {
      return res.status(400).json({ success: false, message: "Please provide subjectId" });
    }
    const section = await quizService.addMockExamSection(mockExamId, req.body);
    return res.status(201).json({ success: true, message: "Section added successfully", section });
  } catch (error) {
    next(error);
  }
};

// PUT /api/mock-exams/:mockExamId/sections/:sectionId  { numberOfQuestions }
export const updateSection = async (req, res, next) => {
  try {
    const sectionId = parseInt(req.params.sectionId, 10);
    if (isNaN(sectionId)) {
      return res.status(400).json({ success: false, message: "Invalid section ID" });
    }
    const section = await quizService.updateMockExamSection(sectionId, req.body);
    return res.status(200).json({ success: true, message: "Section updated successfully", section });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/mock-exams/:mockExamId/sections/:sectionId
export const deleteSection = async (req, res, next) => {
  try {
    const sectionId = parseInt(req.params.sectionId, 10);
    if (isNaN(sectionId)) {
      return res.status(400).json({ success: false, message: "Invalid section ID" });
    }
    await quizService.removeMockExamSection(sectionId);
    return res.status(200).json({ success: true, message: "Section deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// PUT /api/mock-exams/:mockExamId/sections/:sectionId/questions  { questionIds: number[] }
export const setSectionQuestions = async (req, res, next) => {
  try {
    const sectionId = parseInt(req.params.sectionId, 10);
    if (isNaN(sectionId)) {
      return res.status(400).json({ success: false, message: "Invalid section ID" });
    }
    const section = await quizService.setMockExamSectionQuestions(sectionId, req.body.questionIds);
    return res.status(200).json({ success: true, message: "Section questions updated successfully", section });
  } catch (error) {
    next(error);
  }
};

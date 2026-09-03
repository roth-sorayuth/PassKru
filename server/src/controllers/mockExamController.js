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

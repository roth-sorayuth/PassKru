import { prisma } from "../config/prisma.js";

export const getAll = async (filters = {}) => {
  const where = {};
  
  if (filters.subjectId) {
    where.subjectId = parseInt(filters.subjectId, 10);
  }
  
  if (filters.year) {
    where.year = parseInt(filters.year, 10);
  }
  
  if (filters.hasAnswerKey !== undefined) {
    where.hasAnswerKey = filters.hasAnswerKey === "true" || filters.hasAnswerKey === true;
  }
  
  if (filters.paperType) {
    where.paperType = filters.paperType;
  }
  
  if (filters.search) {
    where.title = {
      contains: filters.search,
      mode: "insensitive", // case-insensitive search
    };
  }

  return await prisma.pastPaper.findMany({
    where,
    orderBy: { year: "desc" },
    include: {
      subject: {
        select: {
          subjectId: true,
          subjectName: true,
          examId: true,
          exam: {
            select: {
              examName: true,
              examType: true,
              category: true,
            }
          }
        },
      },
    },
  });
};

export const getById = async (id) => {
  const paper = await prisma.pastPaper.findUnique({
    where: { paperId: id },
    include: {
      subject: true,
    },
  });

  if (!paper) {
    const error = new Error(`Past paper with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return paper;
};

export const create = async (data) => {
  const subjectId = parseInt(data.subjectId, 10);

  // Verify subject exists
  const subjectExists = await prisma.subject.findUnique({
    where: { subjectId },
  });

  if (!subjectExists) {
    const error = new Error(`Subject with ID ${subjectId} not found`);
    error.statusCode = 404;
    throw error;
  }

  return await prisma.pastPaper.create({
    data: {
      subjectId,
      year: data.year ? parseInt(data.year, 10) : null,
      title: data.title,
      session: data.session || null,
      fileUrl: data.fileUrl || null,
      fileSize: data.fileSize || null,
      hasAnswerKey: data.hasAnswerKey === true || data.hasAnswerKey === "true",
      totalQuestions: data.totalQuestions ? parseInt(data.totalQuestions, 10) : null,
      paperType: data.paperType || "past-paper",
    },
  });
};

export const update = async (id, data) => {
  const paperExists = await prisma.pastPaper.findUnique({
    where: { paperId: id },
  });

  if (!paperExists) {
    const error = new Error(`Past paper with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  if (data.subjectId !== undefined) {
    const subjectId = parseInt(data.subjectId, 10);
    const subjectExists = await prisma.subject.findUnique({
      where: { subjectId },
    });

    if (!subjectExists) {
      const error = new Error(`Subject with ID ${subjectId} not found`);
      error.statusCode = 404;
      throw error;
    }
  }

  return await prisma.pastPaper.update({
    where: { paperId: id },
    data: {
      subjectId: data.subjectId !== undefined ? parseInt(data.subjectId, 10) : undefined,
      year: data.year !== undefined ? (data.year ? parseInt(data.year, 10) : null) : undefined,
      title: data.title !== undefined ? data.title : undefined,
      session: data.session !== undefined ? data.session : undefined,
      fileUrl: data.fileUrl !== undefined ? data.fileUrl : undefined,
      fileSize: data.fileSize !== undefined ? data.fileSize : undefined,
      hasAnswerKey: data.hasAnswerKey !== undefined ? (data.hasAnswerKey === true || data.hasAnswerKey === "true") : undefined,
      totalQuestions: data.totalQuestions !== undefined ? (data.totalQuestions ? parseInt(data.totalQuestions, 10) : null) : undefined,
      paperType: data.paperType !== undefined ? data.paperType : undefined,
    },
  });
};

export const remove = async (id) => {
  const paperExists = await prisma.pastPaper.findUnique({
    where: { paperId: id },
  });

  if (!paperExists) {
    const error = new Error(`Past paper with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.pastPaper.delete({
    where: { paperId: id },
  });

  return true;
};

import { prisma } from "../config/prisma.js";

export const getAll = async (filters = {}) => {
  const where = {};
  if (filters.examId) {
    where.examId = parseInt(filters.examId, 10);
  }

  return await prisma.subject.findMany({
    where,
    orderBy: { subjectId: "asc" },
    include: {
      _count: {
        select: { topics: true, pastPapers: true },
      },
      exam: true,
    },
  });
};

export const getById = async (id) => {
  const subject = await prisma.subject.findUnique({
    where: { subjectId: id },
    include: {
      topics: true,
      pastPapers: true,
    },
  });

  if (!subject) {
    const error = new Error(`Subject with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return subject;
};

export const create = async (data) => {
  let examId = null;
  if (data.examId) {
    examId = parseInt(data.examId, 10);
    const examExists = await prisma.exam.findUnique({
      where: { examId },
    });
    if (!examExists) {
      examId = null;
    }
  }

  // If a subject with the same name already exists, return it
  const existing = await prisma.subject.findFirst({
    where: { subjectName: data.subjectName.trim() },
  });
  if (existing) {
    return existing;
  }

  return await prisma.subject.create({
    data: {
      examId,
      subjectName: data.subjectName.trim(),
      description: data.description || null,
    },
  });
};

export const update = async (id, data) => {
  const subjectExists = await prisma.subject.findUnique({
    where: { subjectId: id },
  });

  if (!subjectExists) {
    const error = new Error(`Subject with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  if (data.examId !== undefined) {
    const examId = parseInt(data.examId, 10);
    const examExists = await prisma.exam.findUnique({
      where: { examId },
    });

    if (!examExists) {
      const error = new Error(`Exam with ID ${examId} not found`);
      error.statusCode = 404;
      throw error;
    }
  }

  return await prisma.subject.update({
    where: { subjectId: id },
    data: {
      examId: data.examId !== undefined ? parseInt(data.examId, 10) : undefined,
      subjectName: data.subjectName !== undefined ? data.subjectName : undefined,
      description: data.description !== undefined ? data.description : undefined,
    },
  });
};

export const remove = async (id) => {
  const subjectExists = await prisma.subject.findUnique({
    where: { subjectId: id },
  });

  if (!subjectExists) {
    const error = new Error(`Subject with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.subject.delete({
    where: { subjectId: id },
  });

  return true;
};

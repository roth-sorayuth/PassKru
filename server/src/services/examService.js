import { prisma } from "../config/prisma.js";

export const getAll = async () => {
  return await prisma.exam.findMany({
    orderBy: { examId: "asc" },
  });
};

export const getById = async (id) => {
  const exam = await prisma.exam.findUnique({
    where: { examId: id },
  });

  if (!exam) {
    const error = new Error(`Exam with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return exam;
};

export const create = async (data) => {
  return await prisma.exam.create({
    data: {
      examName: data.examName,
      examType: data.examType || null,
      category: data.category || null,
      targetCode: data.targetCode || null,
      description: data.description || null,
      schedules: data.schedules || null,
      requirements: data.requirements || null,
    },
  });
};

export const update = async (id, data) => {
  const examExists = await prisma.exam.findUnique({
    where: { examId: id },
  });

  if (!examExists) {
    const error = new Error(`Exam with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return await prisma.exam.update({
    where: { examId: id },
    data: {
      examName: data.examName !== undefined ? data.examName : undefined,
      examType: data.examType !== undefined ? data.examType : undefined,
      category: data.category !== undefined ? data.category : undefined,
      targetCode: data.targetCode !== undefined ? data.targetCode : undefined,
      description: data.description !== undefined ? data.description : undefined,
      schedules: data.schedules !== undefined ? data.schedules : undefined,
      requirements: data.requirements !== undefined ? data.requirements : undefined,
    },
  });
};

export const remove = async (id) => {
  const examExists = await prisma.exam.findUnique({
    where: { examId: id },
  });

  if (!examExists) {
    const error = new Error(`Exam with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.exam.delete({
    where: { examId: id },
  });

  return true;
};

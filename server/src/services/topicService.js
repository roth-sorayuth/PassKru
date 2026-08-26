import { prisma } from "../config/prisma.js";

export const getAll = async (filters = {}) => {
  const where = {};
  
  if (filters.subjectId) {
    where.subjectId = parseInt(filters.subjectId, 10);
  }

  return await prisma.topic.findMany({
    where,
    orderBy: { topicId: "asc" },
    include: {
      subject: {
        select: {
          subjectId: true,
          subjectName: true,
          examId: true,
        },
      },
    },
  });
};

export const getById = async (id) => {
  const topic = await prisma.topic.findUnique({
    where: { topicId: id },
    include: {
      subject: true,
    },
  });

  if (!topic) {
    const error = new Error(`Topic with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return topic;
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

  return await prisma.topic.create({
    data: {
      subjectId,
      topicName: data.topicName,
      description: data.description || null,
    },
  });
};

export const update = async (id, data) => {
  const topicExists = await prisma.topic.findUnique({
    where: { topicId: id },
  });

  if (!topicExists) {
    const error = new Error(`Topic with ID ${id} not found`);
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

  return await prisma.topic.update({
    where: { topicId: id },
    data: {
      subjectId: data.subjectId !== undefined ? parseInt(data.subjectId, 10) : undefined,
      topicName: data.topicName !== undefined ? data.topicName : undefined,
      description: data.description !== undefined ? data.description : undefined,
    },
  });
};

export const remove = async (id) => {
  const topicExists = await prisma.topic.findUnique({
    where: { topicId: id },
  });

  if (!topicExists) {
    const error = new Error(`Topic with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.topic.delete({
    where: { topicId: id },
  });

  return true;
};

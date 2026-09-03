import { prisma } from "../config/prisma.js";

export const getAll = async (filters = {}) => {
  const where = {};
  
  if (filters.examId) {
    where.examId = parseInt(filters.examId, 10);
  }
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.isUrgent !== undefined) {
    where.isUrgent = filters.isUrgent === "true" || filters.isUrgent === true;
  }

  return await prisma.announcement.findMany({
    where,
    orderBy: [
      { publishDate: "desc" },
      { announcementId: "desc" },
    ],
    include: {
      exam: {
        select: {
          examId: true,
          examName: true,
        },
      },
    },
  });
};

export const getById = async (id) => {
  const announcement = await prisma.announcement.findUnique({
    where: { announcementId: id },
    include: {
      exam: {
        select: {
          examId: true,
          examName: true,
        },
      },
    },
  });

  if (!announcement) {
    const error = new Error(`Announcement with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return announcement;
};

export const create = async (data) => {
  const examId = parseInt(data.examId, 10);

  // Check if exam exists
  const examExists = await prisma.exam.findUnique({
    where: { examId },
  });

  if (!examExists) {
    const error = new Error(`Exam with ID ${examId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const announcement = await prisma.announcement.create({
    data: {
      examId,
      title: data.title,
      summary: data.summary || null,
      content: data.content || null,
      category: data.category || null,
      isUrgent: data.isUrgent === true || data.isUrgent === "true",
      attachments: data.attachments || null,
    },
  });

  // Automatically dispatch notifications to users targeting this exam
  try {
    const matchingUsers = await prisma.user.findMany({
      where: { targetExamId: examId },
      select: { userId: true },
    });

    if (matchingUsers.length > 0) {
      const allowedCategories = ["announcement", "exam", "reminder", "result", "tip"];
      const notificationCategory = allowedCategories.includes(announcement.category)
        ? announcement.category
        : "announcement";

      const notificationData = matchingUsers.map((u) => ({
        userId: u.userId,
        announcementId: announcement.announcementId,
        title: announcement.title,
        message: announcement.summary || "New announcement available",
        category: notificationCategory,
        actionUrl: `/announcements/${announcement.announcementId}`,
        isRead: false,
      }));

      await prisma.notification.createMany({
        data: notificationData,
      });
    }
  } catch (notificationError) {
    // Log the error but don't crash the announcement creation response
    console.error("Failed to generate notifications for announcement:", notificationError);
  }

  return announcement;
};

export const update = async (id, data) => {
  // Check if announcement exists
  const announcementExists = await prisma.announcement.findUnique({
    where: { announcementId: id },
  });

  if (!announcementExists) {
    const error = new Error(`Announcement with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  // Check if exam exists if it's being updated
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

  return await prisma.announcement.update({
    where: { announcementId: id },
    data: {
      examId: data.examId !== undefined ? parseInt(data.examId, 10) : undefined,
      title: data.title !== undefined ? data.title : undefined,
      summary: data.summary !== undefined ? data.summary : undefined,
      content: data.content !== undefined ? data.content : undefined,
      category: data.category !== undefined ? data.category : undefined,
      isUrgent: data.isUrgent !== undefined ? (data.isUrgent === true || data.isUrgent === "true") : undefined,
      attachments: data.attachments !== undefined ? data.attachments : undefined,
      publishDate: new Date(),
    },
  });
};

export const remove = async (id) => {
  // Check if announcement exists
  const announcementExists = await prisma.announcement.findUnique({
    where: { announcementId: id },
  });

  if (!announcementExists) {
    const error = new Error(`Announcement with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.announcement.delete({
    where: { announcementId: id },
  });

  return true;
};

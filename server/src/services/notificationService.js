import { prisma } from "../config/prisma.js";

export const getUserNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      announcement: {
        select: {
          announcementId: true,
          title: true,
          category: true,
          isUrgent: true,
        },
      },
    },
  });
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await prisma.notification.findFirst({
    where: { notificationId, userId },
  });

  if (!notification) {
    const error = new Error(`Notification not found or unauthorized`);
    error.statusCode = 404;
    throw error;
  }

  return await prisma.notification.update({
    where: { notificationId },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const remove = async (notificationId, userId) => {
  const notification = await prisma.notification.findFirst({
    where: { notificationId, userId },
  });

  if (!notification) {
    const error = new Error(`Notification not found or unauthorized`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.notification.delete({
    where: { notificationId },
  });

  return true;
};

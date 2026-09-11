import * as notificationService from "../services/notificationService.js";

// GET /api/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notifications = await notificationService.getUserNotifications(userId);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/:id/read
export const markNotificationRead = async (req, res, next) => {
  try {
    const notificationId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await notificationService.markAsRead(notificationId, userId);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/read-all
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await notificationService.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const notificationId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    await notificationService.remove(notificationId, userId);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

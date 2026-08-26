import * as announcementService from "../services/announcementService.js";

// GET /api/announcements
export const getAnnouncements = async (req, res, next) => {
  try {
    const { examId, category, isUrgent } = req.query;
    const announcements = await announcementService.getAll({ examId, category, isUrgent });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/announcements/:id
export const getAnnouncementById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
      });
    }

    const announcement = await announcementService.getById(id);

    return res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/announcements
export const createAnnouncement = async (req, res, next) => {
  try {
    const { examId, title, summary, content, category, isUrgent, attachments } = req.body;

    if (!examId || !title) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (examId, title)",
      });
    }

    const announcement = await announcementService.create({
      examId,
      title,
      summary,
      content,
      category,
      isUrgent,
      attachments,
    });

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/announcements/:id
export const updateAnnouncement = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
      });
    }

    const { examId, title, summary, content, category, isUrgent, attachments } = req.body;

    const updatedAnnouncement = await announcementService.update(id, {
      examId,
      title,
      summary,
      content,
      category,
      isUrgent,
      attachments,
    });

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/announcements/:id
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
      });
    }

    await announcementService.remove(id);

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

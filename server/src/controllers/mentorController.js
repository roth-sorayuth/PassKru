import * as mentorService from "../services/mentorService.js";

// GET /api/mentors
export const getMentors = async (req, res, next) => {
  try {
    const { search, subject, page, limit } = req.query;
    const result = await mentorService.getAll({
      search,
      subject,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      count: result.mentors.length,
      pagination: result.pagination,
      mentors: result.mentors,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/mentors/:id
export const getMentorById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor ID",
      });
    }

    const mentor = await mentorService.getById(id);

    return res.status(200).json({
      success: true,
      mentor,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/mentors
export const createMentor = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide both firstName and lastName",
      });
    }

    const mentor = await mentorService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Mentor created successfully",
      mentor,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/mentors/:id
export const updateMentor = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor ID",
      });
    }

    const updatedMentor = await mentorService.update(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Mentor updated successfully",
      mentor: updatedMentor,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/mentors/:id
export const deleteMentor = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor ID",
      });
    }

    await mentorService.remove(id);

    return res.status(200).json({
      success: true,
      message: "Mentor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

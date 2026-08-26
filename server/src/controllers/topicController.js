import * as topicService from "../services/topicService.js";

// GET /api/topics
export const getTopics = async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const topics = await topicService.getAll({ subjectId });

    return res.status(200).json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/topics/:id
export const getTopicById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID",
      });
    }

    const topic = await topicService.getById(id);

    return res.status(200).json({
      success: true,
      topic,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/topics
export const createTopic = async (req, res, next) => {
  try {
    const { subjectId, topicName, description } = req.body;

    if (!subjectId || !topicName) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (subjectId, topicName)",
      });
    }

    const topic = await topicService.create({
      subjectId,
      topicName,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Topic created successfully",
      topic,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/topics/:id
export const updateTopic = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID",
      });
    }

    const { subjectId, topicName, description } = req.body;

    const updatedTopic = await topicService.update(id, {
      subjectId,
      topicName,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Topic updated successfully",
      topic: updatedTopic,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/topics/:id
export const deleteTopic = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID",
      });
    }

    await topicService.remove(id);

    return res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

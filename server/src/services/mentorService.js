import { prisma } from "../config/prisma.js";

/**
 * Get all mentors with optional filtering and pagination
 * @param {Object} filters
 * @param {string} [filters.search] - Search by firstName, lastName, title, or roleLabel
 * @param {string} [filters.subject] - Filter by subject name contained in subjects JSON
 * @param {number} [filters.limit]
 * @param {number} [filters.page]
 */
export const getAll = async (filters = {}) => {
  const where = {};

  if (filters.search) {
    const search = filters.search.trim();
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { roleLabel: { contains: search, mode: "insensitive" } },
    ];
  }

  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const [total, mentors] = await Promise.all([
    prisma.mentor.count({ where }),
    prisma.mentor.findMany({
      where,
      skip,
      take: limit,
      orderBy: { mentorId: "desc" },
      include: {
        _count: {
          select: { mentorBookings: true },
        },
      },
    }),
  ]);

  return {
    mentors,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get single mentor by ID
 * @param {number} id
 */
export const getById = async (id) => {
  const mentor = await prisma.mentor.findUnique({
    where: { mentorId: id },
    include: {
      mentorBookings: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: { mentorBookings: true },
      },
    },
  });

  if (!mentor) {
    const error = new Error(`Mentor with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return mentor;
};

/**
 * Create a new mentor
 * @param {Object} data
 */
export const create = async (data) => {
  return await prisma.mentor.create({
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      title: data.title ? data.title.trim() : null,
      roleLabel: data.roleLabel ? data.roleLabel.trim() : null,
      avatarUrl: data.avatarUrl ? data.avatarUrl.trim() : null,
      experienceYears: data.experienceYears !== undefined && data.experienceYears !== null
        ? parseInt(data.experienceYears, 10)
        : null,
      rating: data.rating !== undefined && data.rating !== null
        ? Number(data.rating)
        : 5.0,
      reviewsCount: data.reviewsCount !== undefined && data.reviewsCount !== null
        ? parseInt(data.reviewsCount, 10)
        : 0,
      studentsTrained: data.studentsTrained !== undefined && data.studentsTrained !== null
        ? parseInt(data.studentsTrained, 10)
        : 0,
      availability: data.availability ? data.availability.trim() : null,
      bio: data.bio ? data.bio.trim() : null,
      hourlyRate: data.hourlyRate ? data.hourlyRate.trim() : null,
      socialTelegram: data.socialTelegram ? data.socialTelegram.trim() : null,
      subjects: data.subjects !== undefined ? data.subjects : [],
    },
  });
};

/**
 * Update an existing mentor
 * @param {number} id
 * @param {Object} data
 */
export const update = async (id, data) => {
  const mentorExists = await prisma.mentor.findUnique({
    where: { mentorId: id },
  });

  if (!mentorExists) {
    const error = new Error(`Mentor with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};

  if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
  if (data.lastName !== undefined) updateData.lastName = data.lastName.trim();
  if (data.title !== undefined) updateData.title = data.title ? data.title.trim() : null;
  if (data.roleLabel !== undefined) updateData.roleLabel = data.roleLabel ? data.roleLabel.trim() : null;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl ? data.avatarUrl.trim() : null;
  if (data.experienceYears !== undefined) {
    updateData.experienceYears = data.experienceYears !== null ? parseInt(data.experienceYears, 10) : null;
  }
  if (data.rating !== undefined) {
    updateData.rating = data.rating !== null ? Number(data.rating) : null;
  }
  if (data.reviewsCount !== undefined) {
    updateData.reviewsCount = data.reviewsCount !== null ? parseInt(data.reviewsCount, 10) : 0;
  }
  if (data.studentsTrained !== undefined) {
    updateData.studentsTrained = data.studentsTrained !== null ? parseInt(data.studentsTrained, 10) : 0;
  }
  if (data.availability !== undefined) {
    updateData.availability = data.availability ? data.availability.trim() : null;
  }
  if (data.bio !== undefined) updateData.bio = data.bio ? data.bio.trim() : null;
  if (data.hourlyRate !== undefined) {
    updateData.hourlyRate = data.hourlyRate ? data.hourlyRate.trim() : null;
  }
  if (data.socialTelegram !== undefined) {
    updateData.socialTelegram = data.socialTelegram ? data.socialTelegram.trim() : null;
  }
  if (data.subjects !== undefined) updateData.subjects = data.subjects;

  return await prisma.mentor.update({
    where: { mentorId: id },
    data: updateData,
  });
};

/**
 * Remove a mentor
 * @param {number} id
 */
export const remove = async (id) => {
  const mentorExists = await prisma.mentor.findUnique({
    where: { mentorId: id },
  });

  if (!mentorExists) {
    const error = new Error(`Mentor with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.mentor.delete({
    where: { mentorId: id },
  });

  return true;
};

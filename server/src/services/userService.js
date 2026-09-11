import { prisma } from "../config/prisma.js";

/**
 * Get all users with optional filtering and search
 */
export async function getAllUsers(filters = {}) {
  const where = {};

  if (filters.role) {
    where.role = filters.role;
  }

  if (filters.targetExamId) {
    where.targetExamId = Number(filters.targetExamId);
  }

  if (filters.search) {
    const q = filters.search.trim();
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phoneNumber: { contains: q, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      targetExam: {
        select: {
          examId: true,
          examName: true,
          category: true,
          examType: true,
        },
      },
      _count: {
        select: {
          attempts: true,
          notifications: true,
          studyPlans: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

/**
 * Get single user by ID
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { userId: Number(userId) },
    include: {
      targetExam: true,
      _count: {
        select: {
          attempts: true,
          notifications: true,
          studyPlans: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Create a new user (admin action)
 */
export async function createUser(data) {
  if (!data.email || !data.firstName || !data.lastName) {
    throw new Error("First name, last name, and email are required.");
  }

  const existing = await prisma.user.findUnique({
    where: { email: data.email.trim().toLowerCase() },
  });

  if (existing) {
    throw new Error("A user with this email address already exists.");
  }

  const allowedRoles = ["candidate", "admin"];
  const role = allowedRoles.includes(data.role?.toLowerCase())
    ? data.role.toLowerCase()
    : "candidate";

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phoneNumber ? data.phoneNumber.trim() : null,
      role,
      targetExamId: data.targetExamId ? Number(data.targetExamId) : null,
      targetSubject: data.targetSubject ? data.targetSubject.trim() : null,
      knowledgeLevel: data.knowledgeLevel ? data.knowledgeLevel.trim() : null,
      passwordHash: data.passwordHash || "managed_clerk_auth",
      avatarUrl: data.avatarUrl || null,
      dailyGoalMinutes: data.dailyGoalMinutes ? Number(data.dailyGoalMinutes) : 30,
    },
    include: {
      targetExam: true,
    },
  });

  return user;
}

/**
 * Update existing user
 */
export async function updateUser(userId, data) {
  const id = Number(userId);

  const existing = await prisma.user.findUnique({
    where: { userId: id },
  });

  if (!existing) {
    throw new Error("User not found.");
  }

  // If updating email, ensure it's not taken by another user
  if (data.email && data.email.trim().toLowerCase() !== existing.email) {
    const emailTaken = await prisma.user.findUnique({
      where: { email: data.email.trim().toLowerCase() },
    });
    if (emailTaken && emailTaken.userId !== id) {
      throw new Error("This email is already in use by another account.");
    }
  }

  const updateData = {};

  if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
  if (data.lastName !== undefined) updateData.lastName = data.lastName.trim();
  if (data.email !== undefined) updateData.email = data.email.trim().toLowerCase();
  if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber ? data.phoneNumber.trim() : null;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
  
  if (data.role !== undefined) {
    const allowedRoles = ["candidate", "admin"];
    if (allowedRoles.includes(data.role?.toLowerCase())) {
      updateData.role = data.role.toLowerCase();
    }
  }

  if (data.targetExamId !== undefined) {
    updateData.targetExamId = data.targetExamId ? Number(data.targetExamId) : null;
  }
  if (data.targetSubject !== undefined) {
    updateData.targetSubject = data.targetSubject ? data.targetSubject.trim() : null;
  }
  if (data.knowledgeLevel !== undefined) {
    updateData.knowledgeLevel = data.knowledgeLevel ? data.knowledgeLevel.trim() : null;
  }
  if (data.dailyGoalMinutes !== undefined) {
    updateData.dailyGoalMinutes = Number(data.dailyGoalMinutes) || 30;
  }

  updateData.updatedAt = new Date();

  const updatedUser = await prisma.user.update({
    where: { userId: id },
    data: updateData,
    include: {
      targetExam: true,
      _count: {
        select: {
          attempts: true,
          notifications: true,
          studyPlans: true,
        },
      },
    },
  });

  return updatedUser;
}

/**
 * Delete user
 */
export async function deleteUser(userId) {
  const id = Number(userId);

  const existing = await prisma.user.findUnique({
    where: { userId: id },
  });

  if (!existing) {
    throw new Error("User not found.");
  }

  await prisma.user.delete({
    where: { userId: id },
  });

  return { message: "User deleted successfully." };
}

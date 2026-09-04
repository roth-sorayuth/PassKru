import { prisma } from "../config/prisma.js";

export const getUserByClerkId = async (clerkId) => {
  return prisma.user.findUnique({
    where: { clerkId },
  });
};

export const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUserFromClerk = async ({
  clerkId,
  email,
  firstName,
  lastName,
}) => {
  if (email) {
    const existing = await getUserByEmail(email);
    if (existing) {
      return prisma.user.update({
        where: { email },
        data: {
          clerkId,
          firstName: firstName || existing.firstName,
          lastName: lastName || existing.lastName,
        },
      });
    }
  }

  return prisma.user.create({
    data: {
      clerkId,
      email: email || `${clerkId}@clerk.local`,
      firstName: firstName || "User",
      lastName: lastName || "",
      passwordHash: "managed-by-clerk",
      role: "candidate",
    },
  });
};

export const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { userId: Number(userId) },
  });
};

/**
 * Same row as getUserById but with the target exam resolved, so callers can
 * read `targetExam.targetCode` ("nie"/"rttc"/...) instead of guessing which
 * numeric examId maps to which track — the ids differ per environment.
 */
export const getUserWithExam = async (userId) => {
  return prisma.user.findUnique({
    where: { userId: Number(userId) },
    include: {
      targetExam: { select: { examId: true, examName: true, targetCode: true } },
    },
  });
};

/**
 * Self-service profile update. Deliberately whitelist-only — email/role/
 * clerkId/passwordHash stay off-limits here since identity and permissions
 * are managed elsewhere (Clerk sign-in, admin user management).
 */
export const updateOwnProfile = async (userId, fields = {}) => {
  const updateData = {};

  if (fields.firstName !== undefined) updateData.firstName = String(fields.firstName).trim();
  if (fields.lastName !== undefined) updateData.lastName = String(fields.lastName).trim();
  if (fields.phoneNumber !== undefined) updateData.phoneNumber = fields.phoneNumber ? String(fields.phoneNumber).trim() : null;
  if (fields.avatarUrl !== undefined) updateData.avatarUrl = fields.avatarUrl ? String(fields.avatarUrl).trim() : null;
  if (fields.targetExamId !== undefined) {
    updateData.targetExamId = fields.targetExamId !== null ? Number(fields.targetExamId) : null;
  }
  // Preferred over targetExamId: the client sends the track code and the
  // server resolves the row, so no environment-specific ids are hardcoded
  // client-side (they were, and they were wrong).
  if (fields.targetExamCode !== undefined) {
    const code = fields.targetExamCode ? String(fields.targetExamCode).trim().toLowerCase() : null;
    if (!code) {
      updateData.targetExamId = null;
    } else {
      const exam = await prisma.exam.findFirst({
        where: { targetCode: { equals: code, mode: "insensitive" } },
        select: { examId: true },
      });
      if (!exam) {
        const error = new Error(`No exam found for target code "${code}"`);
        error.statusCode = 400;
        throw error;
      }
      updateData.targetExamId = exam.examId;
    }
  }
  if (fields.targetSubject !== undefined) updateData.targetSubject = fields.targetSubject ? String(fields.targetSubject).trim() : null;
  if (fields.targetSubjects !== undefined) {
    const list = Array.isArray(fields.targetSubjects) ? fields.targetSubjects.filter(Boolean) : [];
    updateData.targetSubjects = list;
    // Keep the legacy column coherent for anything still reading it.
    if (fields.targetSubject === undefined) updateData.targetSubject = list[0] || null;
  }
  if (fields.knowledgeLevel !== undefined) updateData.knowledgeLevel = fields.knowledgeLevel ? String(fields.knowledgeLevel).trim() : null;
  if (fields.availableStudyHours !== undefined) {
    updateData.availableStudyHours = fields.availableStudyHours !== null ? Number(fields.availableStudyHours) : null;
  }
  if (fields.dailyGoalMinutes !== undefined) updateData.dailyGoalMinutes = Number(fields.dailyGoalMinutes);

  return prisma.user.update({
    where: { userId: Number(userId) },
    data: updateData,
  });
};
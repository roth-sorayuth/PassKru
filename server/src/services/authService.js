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
  const user = await prisma.user.findUnique({
    where: { userId: Number(userId) },
    include: {
      targetExam: { select: { examId: true, examName: true, targetCode: true } },
    },
  });

  if (!user) return null;

  let selectionMeta = {};
  if (user.knowledgeLevel) {
    try {
      selectionMeta = JSON.parse(user.knowledgeLevel);
    } catch {
      // not JSON
    }
  }

  const categoryNameMap = {
    nie: 'កម្រិតឧត្តម (វិទ្យាល័យ)',
    rttc: 'កម្រិតមូលដ្ឋាន (អនុវិទ្យាល័យ)',
    pttc: 'កម្រិតបឋមសិក្សា',
  };

  const examCategory =
    selectionMeta.examCategory ||
    (user.targetExam?.targetCode ? categoryNameMap[user.targetExam.targetCode.toLowerCase()] : undefined);

  const selectedSubjects =
    selectionMeta.selectedSubjects ||
    (Array.isArray(user.targetSubjects) && user.targetSubjects.length > 0 ? user.targetSubjects : undefined);

  const hasCompletedExamSelection =
    selectionMeta.hasCompletedExamSelection !== undefined
      ? selectionMeta.hasCompletedExamSelection
      : Boolean(examCategory && selectedSubjects && selectedSubjects.length > 0);

  return {
    ...user,
    examCategory,
    selectedSubjects,
    hasCompletedExamSelection,
  };
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

  // Handle examCategory to targetExamCode mapping if provided
  let targetExamCode = fields.targetExamCode;
  if (!targetExamCode && fields.examCategory) {
    const cat = String(fields.examCategory).toLowerCase();
    if (cat.includes('ឧត្តម') || cat.includes('វិទ្យាល័យ') || cat.includes('nie')) {
      targetExamCode = 'nie';
    } else if (cat.includes('មូលដ្ឋាន') || cat.includes('អនុវិទ្យាល័យ') || cat.includes('rttc')) {
      targetExamCode = 'rttc';
    } else if (cat.includes('បឋម') || cat.includes('pttc')) {
      targetExamCode = 'pttc';
    }
  }

  if (targetExamCode !== undefined) {
    const code = targetExamCode ? String(targetExamCode).trim().toLowerCase() : null;
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

  const subjects = fields.selectedSubjects || fields.targetSubjects;
  if (subjects !== undefined) {
    const list = Array.isArray(subjects) ? subjects.filter(Boolean) : [];
    updateData.targetSubjects = list;
    const elective = list.find(s => !s.includes('វប្បធម៌ទូទៅ') && !s.includes('General Culture')) || list[0];
    updateData.targetSubject = elective || null;
  } else if (fields.targetSubject !== undefined) {
    updateData.targetSubject = fields.targetSubject ? String(fields.targetSubject).trim() : null;
  }

  // Store user exam selection metadata inside knowledgeLevel JSON safely
  if (
    fields.examCategory !== undefined ||
    fields.selectedSubjects !== undefined ||
    fields.hasCompletedExamSelection !== undefined
  ) {
    const existing = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      select: { knowledgeLevel: true },
    });
    let meta = {};
    if (existing?.knowledgeLevel) {
      try {
        meta = JSON.parse(existing.knowledgeLevel);
      } catch {
        meta = {};
      }
    }
    if (fields.examCategory !== undefined) meta.examCategory = fields.examCategory;
    if (fields.selectedSubjects !== undefined) meta.selectedSubjects = fields.selectedSubjects;
    if (fields.hasCompletedExamSelection !== undefined) meta.hasCompletedExamSelection = Boolean(fields.hasCompletedExamSelection);
    updateData.knowledgeLevel = JSON.stringify(meta);
  } else if (fields.knowledgeLevel !== undefined) {
    updateData.knowledgeLevel = fields.knowledgeLevel ? String(fields.knowledgeLevel).trim() : null;
  }

  if (fields.availableStudyHours !== undefined) {
    updateData.availableStudyHours = fields.availableStudyHours !== null ? Number(fields.availableStudyHours) : null;
  }
  if (fields.dailyGoalMinutes !== undefined) updateData.dailyGoalMinutes = Number(fields.dailyGoalMinutes);

  await prisma.user.update({
    where: { userId: Number(userId) },
    data: updateData,
  });

  return getUserWithExam(userId);
};
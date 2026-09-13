import { prisma } from "../config/prisma.js";
import { normalizeSubjectSelection } from "../config/examSubjects.js";

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

  // Exam selection is derived from real columns only. It used to be stored as
  // JSON inside knowledgeLevel — a VARCHAR(50) — so the write overflowed for
  // any real Khmer selection and knowledgeLevel stopped meaning "level".
  const targetCode = user.targetExam?.targetCode?.toLowerCase() || null;
  const selection = targetCode ? normalizeSubjectSelection(targetCode, user.targetSubjects) : null;

  return {
    ...user,
    knowledgeLevel: KNOWLEDGE_LEVELS.includes(user.knowledgeLevel) ? user.knowledgeLevel : null,
    examCategory: targetCode ? EXAM_CATEGORY_NAMES[targetCode] : undefined,
    // Keys (["math"], ["math","ict"], PTTC ["math","khmer"]). Legacy label rows are
    // converted on read and rewritten the next time the candidate saves.
    selectedSubjects: selection?.ok ? selection.keys : [],
    hasCompletedExamSelection: Boolean(selection?.ok),
  };
};

export const KNOWLEDGE_LEVELS = ["beginner", "intermediate", "advanced"];

const EXAM_CATEGORY_NAMES = {
  nie: "កម្រិតឧត្តម (វិទ្យាល័យ)",
  rttc: "កម្រិតមូលដ្ឋាន (អនុវិទ្យាល័យ)",
  pttc: "កម្រិតបឋមសិក្សា",
  kindergarten: "មត្តេយ្យសិក្សា",
};

/** Maps a Khmer category title back to its exam code, for older clients. */
function examCodeFromCategory(category) {
  const cat = String(category || "").toLowerCase();
  if (!cat) return undefined;
  // "អនុវិទ្យាល័យ" contains "វិទ្យាល័យ", so lower secondary is checked first.
  if (cat.includes("មត្តេយ្យ") || cat.includes("kindergarten")) return "kindergarten";
  if (cat.includes("អនុវិទ្យាល័យ") || cat.includes("មូលដ្ឋាន") || cat.includes("rttc")) return "rttc";
  if (cat.includes("ឧត្តម") || cat.includes("វិទ្យាល័យ") || cat.includes("nie")) return "nie";
  if (cat.includes("បឋម") || cat.includes("pttc")) return "pttc";
  return undefined;
}

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

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

  // Step 1 — exam track. targetExamCode is canonical; examCategory (a Khmer
  // title) is only accepted as a fallback for older clients.
  const targetExamCode =
    fields.targetExamCode !== undefined ? fields.targetExamCode : examCodeFromCategory(fields.examCategory);
  const subjectsInput = fields.targetSubjects ?? fields.selectedSubjects;

  let examCode;
  if (targetExamCode !== undefined) {
    examCode = targetExamCode ? String(targetExamCode).trim().toLowerCase() : null;
    if (!examCode) {
      updateData.targetExamId = null;
      updateData.targetSubjects = [];
      updateData.targetSubject = null;
    } else {
      const exam = await prisma.exam.findFirst({
        where: { targetCode: { equals: examCode, mode: "insensitive" } },
        select: { examId: true },
      });
      if (!exam) throw badRequest(`No exam found for target code "${examCode}"`);
      updateData.targetExamId = exam.examId;
    }
  }

  // Step 1.5 — subjects, validated against the track's rule. Changing the
  // track always re-validates, so a stale NIE major can't survive a switch to
  // RTTC; PTTC resolves to ["math","khmer"] and kindergarten to ["generalist"] with no input.
  if (examCode || subjectsInput !== undefined) {
    if (!examCode) {
      const current = await prisma.user.findUnique({
        where: { userId: Number(userId) },
        select: { targetExam: { select: { targetCode: true } } },
      });
      examCode = current?.targetExam?.targetCode?.toLowerCase();
      if (!examCode) throw badRequest("Choose an exam track before choosing subjects");
    }
    const selection = normalizeSubjectSelection(examCode, subjectsInput ?? []);
    if (!selection.ok) throw badRequest(selection.message);
    updateData.targetSubjects = selection.keys;
    updateData.targetSubject = selection.keys[0] || null;
  } else if (fields.targetSubject !== undefined) {
    updateData.targetSubject = fields.targetSubject ? String(fields.targetSubject).trim() : null;
  }

  if (fields.knowledgeLevel !== undefined) {
    if (fields.knowledgeLevel !== null && !KNOWLEDGE_LEVELS.includes(fields.knowledgeLevel)) {
      throw badRequest(`knowledgeLevel must be one of: ${KNOWLEDGE_LEVELS.join(", ")}`);
    }
    updateData.knowledgeLevel = fields.knowledgeLevel;
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
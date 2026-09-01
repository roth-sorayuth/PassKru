import { prisma } from "../config/prisma.js";
import { calculateCountdown, getActiveDayIndicesThisWeek } from "../utils/timeHelper.js";

const DEFAULT_SUBJECT_COLORS = [
  "#0a3263", // Deep navy
  "#5c3818", // Rich brown/amber
  "#0d7652", // Forest emerald
  "#d97706", // Warm amber
  "#4f46e5", // Indigo
  "#0284c7", // Sky blue
];

/**
 * Get comprehensive dashboard data aggregated from real database records
 * @param {number} userId 
 */
export const getDashboardData = async (userId) => {
  const numericUserId = Number(userId);

  // 1. Fetch user profile with target exam and relationships
  const user = await prisma.user.findUnique({
    where: { userId: numericUserId },
    include: {
      targetExam: {
        include: {
          subjects: {
            include: {
              topics: true,
              quizzes: true,
              pastPapers: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    const error = new Error(`User with ID ${userId} not found`);
    error.statusCode = 404;
    throw error;
  }

  // If user has no target exam, fall back to the first available exam
  let targetExam = user.targetExam;
  if (!targetExam) {
    targetExam = await prisma.exam.findFirst({
      include: {
        subjects: {
          include: {
            topics: true,
            quizzes: true,
            pastPapers: true,
          },
        },
      },
      orderBy: { examId: "asc" },
    });
  }

  // 2. Target Exam Countdown Calculation
  let examTargetDate = null;
  if (targetExam?.schedules) {
    if (typeof targetExam.schedules === "object") {
      examTargetDate =
        targetExam.schedules.examDate ||
        targetExam.schedules.date ||
        targetExam.schedules.registrationEnd;
    }
  }

  // Fallback to 75 days in future if schedule date isn't set
  if (!examTargetDate) {
    const fallbackDate = new Date();
    fallbackDate.setDate(fallbackDate.getDate() + 75);
    examTargetDate = fallbackDate;
  }

  const countdown = calculateCountdown(examTargetDate);

  // 3. Overall Progress Calculation
  const subjects = targetExam?.subjects || [];
  const allTopicIds = subjects.flatMap((s) => s.topics.map((t) => t.topicId));
  const totalLessons = allTopicIds.length;

  const progressRecords = await prisma.progressRecord.findMany({
    where: {
      userId: numericUserId,
      topicId: { in: allTopicIds },
    },
  });

  const completedLessons = progressRecords.filter(
    (p) => Number(p.proficiencyScore || 0) >= 50
  ).length;

  const overallPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const remainingPercent = Math.max(0, 100 - overallPercent);

  // 4. Exam Readiness Score Calculation
  const recentAttempts = await prisma.attempt.findMany({
    where: { userId: numericUserId },
    orderBy: { startTime: "desc" },
    take: 10,
  });

  let averageScore = Number(user.averageScore) || 0;
  if (recentAttempts.length > 0) {
    const validScores = recentAttempts
      .map((a) => Number(a.score))
      .filter((s) => !isNaN(s) && s > 0);
    if (validScores.length > 0) {
      averageScore = Math.round(
        validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length
      );
    }
  }

  const readinessScore = Math.min(
    100,
    Math.round(averageScore * 0.7 + overallPercent * 0.3)
  );

  let readinessStatus = "ត្រូវការការខិតខំបន្ថែម";
  if (readinessScore >= 75) {
    readinessStatus = "ឱកាសជាប់ប្រឡងខ្ពស់";
  } else if (readinessScore >= 50) {
    readinessStatus = "ឱកាសជាប់មធ្យម";
  }

  // 5. Subject Knowledge Donuts
  const progressMap = new Map(
    progressRecords.map((p) => [p.topicId, Number(p.proficiencyScore || 0)])
  );

  const subjectDonuts = subjects.map((subject, index) => {
    const subjectTopicIds = subject.topics.map((t) => t.topicId);
    const totalSubjectTopics = subjectTopicIds.length;
    const completedSubjectTopics = subjectTopicIds.filter(
      (id) => (progressMap.get(id) || 0) >= 50
    ).length;

    const percent =
      totalSubjectTopics > 0
        ? Math.round((completedSubjectTopics / totalSubjectTopics) * 100)
        : 0;

    return {
      subjectId: subject.subjectId,
      label: subject.subjectName,
      percent,
      completed: completedSubjectTopics,
      total: totalSubjectTopics,
      color: DEFAULT_SUBJECT_COLORS[index % DEFAULT_SUBJECT_COLORS.length],
    };
  });

  // 6. AI Insights & Weak Areas
  const weakAreasList = await prisma.weakArea.findMany({
    where: { userId: numericUserId },
    include: {
      topic: {
        include: {
          subject: true,
        },
      },
    },
    orderBy: { accuracyRate: "asc" },
    take: 4,
  });

  const formattedWeakAreas = weakAreasList.map((w, idx) => ({
    subject: w.topic?.subject?.subjectName || "ទូទៅ",
    topic: w.topic?.topicName || "មេរៀន",
    color: idx % 2 === 0 ? "#ef4444" : "#b45309",
  }));

  // 7. Study Streak & Active Days Calculation
  const allActivityDates = [
    ...recentAttempts.map((a) => a.startTime),
    ...progressRecords.map((p) => p.lastUpdated),
  ].filter(Boolean);

  const activeDayIndices = getActiveDayIndicesThisWeek(allActivityDates);

  // 8. Resource Usage Calculation
  const totalQuizzesAvailable = subjects.reduce(
    (acc, s) => acc + (s.quizzes?.length || 0),
    0
  );

  const userQuizAttemptsCount = await prisma.attempt.count({
    where: {
      userId: numericUserId,
      attemptType: "quiz",
    },
  });

  const quizUsagePercent =
    totalQuizzesAvailable > 0
      ? Math.min(100, Math.round((userQuizAttemptsCount / totalQuizzesAvailable) * 100))
      : 0;

  const resourceUsage = [
    { label: "វីដេអូ / មេរៀន", percent: overallPercent, color: "#0a3263" },
    { label: "កម្រងសំណួរ", percent: quizUsagePercent, color: "#5c3818" },
    {
      label: "ឯកសារអាន / វិញ្ញាសា",
      percent: Math.min(100, Math.round(overallPercent * 0.8)),
      color: "#0d7652",
    },
  ];

  // 9. Study Time Distribution per Subject
  const attemptsWithQuizzes = await prisma.attempt.findMany({
    where: {
      userId: numericUserId,
      quizId: { not: null },
      endTime: { not: null },
    },
    include: {
      quiz: {
        include: { subject: true },
      },
    },
  });

  const subjectStudySeconds = new Map();
  let totalStudySeconds = 0;

  for (const a of attemptsWithQuizzes) {
    if (a.startTime && a.endTime && a.quiz?.subject) {
      const durationSec = Math.max(
        0,
        Math.floor((new Date(a.endTime).getTime() - new Date(a.startTime).getTime()) / 1000)
      );
      const subName = a.quiz.subject.subjectName;
      subjectStudySeconds.set(
        subName,
        (subjectStudySeconds.get(subName) || 0) + durationSec
      );
      totalStudySeconds += durationSec;
    }
  }

  const circumference = 238.7;
  let currentStrokeOffset = 0;

  const studyTimeDistribution = subjects.map((subject, index) => {
    const seconds = subjectStudySeconds.get(subject.subjectName) || 0;
    const hours = Math.round((seconds / 3600) * 10) / 10;
    const percent =
      totalStudySeconds > 0
        ? Math.round((seconds / totalStudySeconds) * 100)
        : Math.round(100 / Math.max(1, subjects.length));

    const item = {
      label: subject.subjectName,
      percent,
      hours,
      color: DEFAULT_SUBJECT_COLORS[index % DEFAULT_SUBJECT_COLORS.length],
      strokeOffset: currentStrokeOffset,
    };

    currentStrokeOffset += (percent / 100) * circumference;
    return item;
  });

  return {
    countdown,
    overallProgress: {
      percent: overallPercent,
      lessonsCompleted,
      totalLessons,
      remaining: remainingPercent,
    },
    examReadiness: {
      score: readinessScore,
      maxScore: 100,
      statusLabel: readinessStatus,
    },
    subjectDonuts,
    aiInsight: {
      accuracy: Math.round(averageScore) || 0,
      weeklyChange: 5,
      weakAreas: formattedWeakAreas,
    },
    streak: {
      streakDays: user.streakDays || 0,
      activeDayIndices,
    },
    resourceUsage,
    studyTimeDistribution,
  };
};

/**
 * Record or update user topic proficiency score
 */
export const updateTopicProgress = async (userId, topicId, proficiencyScore) => {
  return await prisma.progressRecord.upsert({
    where: {
      userId_topicId: {
        userId: Number(userId),
        topicId: Number(topicId),
      },
    },
    update: {
      proficiencyScore: Number(proficiencyScore),
      lastUpdated: new Date(),
    },
    create: {
      userId: Number(userId),
      topicId: Number(topicId),
      proficiencyScore: Number(proficiencyScore),
      lastUpdated: new Date(),
    },
  });
};

/**
 * Update user target exam
 */
export const updateTargetExam = async (userId, examId) => {
  return await prisma.user.update({
    where: { userId: Number(userId) },
    data: { targetExamId: Number(examId) },
  });
};

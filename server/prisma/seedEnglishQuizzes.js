/**
 * Seeds English Quiz sets directly from quizData.json into PostgreSQL via Prisma:
 * - Ensures English subject exists for 'nie', 'rttc', and 'pttc'
 * - Creates English topics under each subject
 * - Seeds all 500 questions and their 2,000 answer options
 * - Creates 10 Quiz records per track (50 questions per set)
 * - Associates questions to each quiz via QuizQuestion in order 1..50
 *
 * Run with: node prisma/seedEnglishQuizzes.js
 */
import { prisma } from "../src/config/prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find quizData.json in server, client, or project root
function findQuizData() {
  const possiblePaths = [
    path.resolve(__dirname, "../../quizData.json"),
    path.resolve(__dirname, "../../client/src/data/quizData.json"),
    path.resolve(__dirname, "../quizData.json"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf8"));
    }
  }
  throw new Error("Could not find quizData.json in any expected path");
}

const TARGET_EXAMS = [
  { targetCode: "nie", name: "កម្រិតឧត្តម" },
  { targetCode: "rttc", name: "កម្រិតមូលដ្ឋាន" },
  { targetCode: "pttc", name: "កម្រិតបឋម" },
];

async function main() {
  console.log("=== Starting English Quizzes Database Seeding ===");

  const rawQuestions = findQuizData();
  console.log(`Found ${rawQuestions.length} questions in quizData.json`);

  // 1. Ensure Exams and English Subjects exist
  const examSubjectMap = [];

  for (const t of TARGET_EXAMS) {
    let exam = await prisma.exam.findFirst({
      where: { targetCode: t.targetCode },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          examName: t.name,
          targetCode: t.targetCode,
          category: t.targetCode,
        },
      });
      console.log(`Created Exam: ${t.name} (${t.targetCode})`);
    }

    // Check for existing subject with name 'ភាសាអង់គ្លេស' or 'ភាសារអង់គ្លេស'
    let subject = await prisma.subject.findFirst({
      where: {
        examId: exam.examId,
        OR: [{ subjectName: "ភាសាអង់គ្លេស" }, { subjectName: "ភាសារអង់គ្លេស" }],
      },
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          examId: exam.examId,
          subjectName: "ភាសាអង់គ្លេស",
          description: "មុខវិជ្ជាភាសាអង់គ្លេសសម្រាប់ការប្រឡងគ្រូបង្រៀន",
        },
      });
      console.log(`Created Subject 'ភាសាអង់គ្លេស' for Exam ID ${exam.examId}`);
    } else if (subject.subjectName !== "ភាសាអង់គ្លេស") {
      // Standardize name to ភាសាអង់គ្លេស
      subject = await prisma.subject.update({
        where: { subjectId: subject.subjectId },
        data: { subjectName: "ភាសាអង់គ្លេស" },
      });
      console.log(`Updated Subject ID ${subject.subjectId} to 'ភាសាអង់គ្លេស'`);
    }

    // Ensure English topic exists under this subject
    let topic = await prisma.topic.findFirst({
      where: {
        subjectId: subject.subjectId,
        topicName: "សមត្ថភាពភាសាអង់គ្លេសទូទៅ",
      },
    });

    if (!topic) {
      topic = await prisma.topic.create({
        data: {
          subjectId: subject.subjectId,
          topicName: "សមត្ថភាពភាសាអង់គ្លេសទូទៅ",
          description: "General English Competency & Assessment",
        },
      });
      console.log(`Created Topic 'សមត្ថភាពភាសាអង់គ្លេសទូទៅ' for Subject ID ${subject.subjectId}`);
    }

    examSubjectMap.push({ exam, subject, topic });
  }

  // Use the first topic (NIE) as the primary topic for questions
  const primaryTopic = examSubjectMap[0].topic;

  // 2. Insert or get all 500 questions into the Question & AnswerOption tables
  console.log("Seeding questions and answer options into database...");
  const createdQuestionIds = [];

  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i];
    const qId = q.questionID || (i + 1);

    let existing = await prisma.question.findUnique({
      where: { questionId: qId },
      select: { questionId: true },
    });

    if (!existing) {
      existing = await prisma.question.create({
        data: {
          questionId: qId,
          topicId: primaryTopic.topicId,
          examName: q.examName || "National Teacher Examination (Primary, Lower and Upper Secondary)",
          subjectName: q.subjectName || "English",
          questionText: q.questionText,
          questionType: q.questionType || "multiple_choice",
          difficultyLevel: q.difficultyLevel || "medium",
          correctAnswer: q.correctAnswer || "",
          explanation: q.explanation || "",
          referenceNote: q.referenceNote || "English Proficiency Assessment",
          answerOptions: {
            create: (q.options || []).map((opt) => ({
              optionText: opt.text,
              isCorrect: Boolean(opt.isCorrect),
            })),
          },
        },
        select: { questionId: true },
      });
    }

    createdQuestionIds.push(existing.questionId);

    if ((i + 1) % 100 === 0 || i === rawQuestions.length - 1) {
      console.log(`Processed ${i + 1}/${rawQuestions.length} questions...`);
    }
  }

  console.log(`Successfully verified ${createdQuestionIds.length} questions in database.`);

  // 3. Create 10 Quizzes per Exam Target and link the 50 questions to each set
  for (const { exam, subject } of examSubjectMap) {
    console.log(`Creating 10 quizzes for ${exam.examName} (${exam.targetCode})...`);

    for (let setIdx = 0; setIdx < 10; setIdx++) {
      const setNumber = setIdx + 1;
      const title = `កម្រងសំណួរភាសាអង់គ្លេស វិញ្ញាសារទី ${setNumber}`;

      let quiz = await prisma.quiz.findFirst({
        where: {
          subjectId: subject.subjectId,
          title,
        },
      });

      if (!quiz) {
        quiz = await prisma.quiz.create({
          data: {
            subjectId: subject.subjectId,
            title,
            difficultyLevel: "medium",
            durationMinutes: 50,
          },
        });
        console.log(`Created Quiz ID ${quiz.quizId}: ${title}`);
      } else {
        console.log(`Quiz ID ${quiz.quizId} already exists: ${title}`);
      }

      // 50 questions slice for this set
      const startIndex = setIdx * 50;
      const setQuestionIds = createdQuestionIds.slice(startIndex, startIndex + 50);

      for (let order = 0; order < setQuestionIds.length; order++) {
        const questionId = setQuestionIds[order];
        await prisma.quizQuestion.upsert({
          where: {
            quizId_questionId: {
              quizId: quiz.quizId,
              questionId,
            },
          },
          update: {
            questionOrder: order + 1,
          },
          create: {
            quizId: quiz.quizId,
            questionId,
            questionOrder: order + 1,
          },
        });
      }
    }
  }

  console.log("=== English Quizzes Database Seeding Complete! ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed with error:", err);
  process.exit(1);
});


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../src/config/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possiblePaths = [
  path.resolve(__dirname, "../../quizData.json"),
  path.resolve(__dirname, "../quizData.json"),
  path.resolve(__dirname, "quizData.json"),
];

let rawQuestions = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    console.log("Loading questions from " + p);
    rawQuestions = JSON.parse(fs.readFileSync(p, "utf8"));
    break;
  }
}

if (!rawQuestions || !Array.isArray(rawQuestions)) {
  throw new Error("Could not find quizData.json");
}

console.log("Found " + rawQuestions.length + " questions in quizData.json");

const TARGET_EXAMS = [
  { targetCode: "nie", name: "??????????? (NIE)" },
  { targetCode: "rttc", name: "?????????????? (RTTC)" },
  { targetCode: "pttc", name: "????????? (PTTC)" },
];

async function main() {
  console.log("=== Starting English Quiz Database Re-population with IDs 1..500 ===");

  const examSubjectMap = [];
  for (const t of TARGET_EXAMS) {
    let exam = await prisma.exam.findFirst({ where: { targetCode: t.targetCode } });
    if (!exam) {
      exam = await prisma.exam.create({
        data: { examName: t.name, targetCode: t.targetCode, category: t.targetCode },
      });
    }

    let subject = await prisma.subject.findFirst({
      where: {
        examId: exam.examId,
        OR: [{ subjectName: "????????????" }, { subjectName: "?????????????" }],
      },
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          examId: exam.examId,
          subjectName: "????????????",
          description: "??????????????????????????????????????????????",
        },
      });
    } else if (subject.subjectName !== "????????????") {
      subject = await prisma.subject.update({
        where: { subjectId: subject.subjectId },
        data: { subjectName: "????????????" },
      });
    }

    let topic = await prisma.topic.findFirst({
      where: { subjectId: subject.subjectId, topicName: "????????????????????????" },
    });

    if (!topic) {
      topic = await prisma.topic.create({
        data: {
          subjectId: subject.subjectId,
          topicName: "????????????????????????",
          description: "General English Competency & Assessment",
        },
      });
    }

    examSubjectMap.push({ exam, subject, topic });
  }

  const primaryTopic = examSubjectMap[0].topic;

  console.log("Clearing existing questions and relations...");
  await prisma.$executeRawUnsafe("DELETE FROM attempt_answer;");
  await prisma.$executeRawUnsafe("DELETE FROM quiz_question;");
  await prisma.$executeRawUnsafe("DELETE FROM answer_option;");
  await prisma.$executeRawUnsafe("DELETE FROM question;");
  await prisma.$executeRawUnsafe("ALTER SEQUENCE question_question_id_seq RESTART WITH 1;");
  await prisma.$executeRawUnsafe("ALTER SEQUENCE answer_option_option_id_seq RESTART WITH 1;");

  console.log("Seeding 500 questions with questionId 1..500, examName, and subjectName...");

  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i];
    const qId = q.questionID || (i + 1);

    await prisma.question.create({
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
    });

    if ((i + 1) % 100 === 0 || i === rawQuestions.length - 1) {
      console.log(`Inserted ${i + 1}/${rawQuestions.length} questions...`);
    }
  }

  await prisma.$executeRawUnsafe("SELECT setval('public.question_question_id_seq', 500);");

  console.log("Linking 50 questions to each of the 10 quizzes per category...");
  for (const { exam, subject } of examSubjectMap) {
    console.log(`Linking for ${exam.examName} (${exam.targetCode})...`);

    for (let setIdx = 0; setIdx < 10; setIdx++) {
      const setNumber = setIdx + 1;
      const title = `?????????????????????? ????? ${setNumber}`;

      let quiz = await prisma.quiz.findFirst({
        where: { subjectId: subject.subjectId, title },
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
      }

      const startId = setIdx * 50 + 1;
      for (let order = 1; order <= 50; order++) {
        const questionId = startId + (order - 1);
        await prisma.quizQuestion.create({
          data: {
            quizId: quiz.quizId,
            questionId,
            questionOrder: order,
          },
        });
      }
    }
  }

  console.log("=== Successfully Completed! ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error during seeding:", err);
  process.exit(1);
});

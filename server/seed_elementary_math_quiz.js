import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function chunkArray(arr, numChunks) {
  const result = [];
  const chunkSize = Math.ceil(arr.length / numChunks);
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

async function main() {
  console.log("=== Seeding Elementary Math Questions & Quizzes ===\n");

  // 1. Read clean JSON questions
  const rawContent = fs.readFileSync("clean_math_questions.json", "utf8");
  const rawQuestions = JSON.parse(rawContent);

  console.log(`Loaded ${rawQuestions.length} complete questions.`);

  // 2. Ensure Topic exists for Elementary Math (subjectId: 1)
  const ELEMENTARY_SUBJECT_ID = 1;

  let topic = await prisma.topic.findFirst({
    where: { subjectId: ELEMENTARY_SUBJECT_ID, topicName: "គណិតវិទ្យាទូទៅ - ថ្នាក់បឋម" }
  });

  if (!topic) {
    topic = await prisma.topic.create({
      data: {
        subjectId: ELEMENTARY_SUBJECT_ID,
        topicName: "គណិតវិទ្យាទូទៅ - ថ្នាក់បឋម",
        description: "General Mathematics topics for Elementary Teacher Exam (PTTC)"
      }
    });
    console.log(`Created topic: ${topic.topicName} [ID: ${topic.topicId}]`);
  } else {
    console.log(`Using existing topic: ${topic.topicName} [ID: ${topic.topicId}]`);
  }

  // 3. Insert questions into DB with exam_name = "elementary"
  let inserted = 0;
  let skipped = 0;
  const insertedQuestions = [];

  for (const q of rawQuestions) {
    const questionText = q.questionText.trim();
    const difficultyLevel = (q.difficultyLevel || "Medium").toLowerCase();
    const correctAnswer = q.correctAnswer;
    const explanation = q.explanation || null;
    const referenceNote = q.referenceNote || null;

    // Check duplicate
    const exists = await prisma.question.findFirst({
      where: {
        topicId: topic.topicId,
        questionText: questionText
      }
    });

    if (exists) {
      insertedQuestions.push(exists);
      skipped++;
      continue;
    }

    const created = await prisma.question.create({
      data: {
        topicId: topic.topicId,
        examName: "elementary",
        subjectName: "Mathematics",
        questionText: questionText,
        questionType: "multiple_choice",
        difficultyLevel: difficultyLevel,
        correctAnswer: correctAnswer,
        explanation: explanation,
        referenceNote: referenceNote,
        answerOptions: {
          create: (q.options || []).map(opt => ({
            optionText: opt.text,
            isCorrect: Boolean(opt.isCorrect)
          }))
        }
      }
    });

    console.log(`  [${created.questionId}] elementary | ${questionText.substring(0, 50)}...`);
    insertedQuestions.push(created);
    inserted++;
  }

  console.log(`\nQuestions summary: ${inserted} newly inserted, ${skipped} existing/skipped. Total: ${insertedQuestions.length}`);

  // 4. Divide into equal Quiz Cards for Elementary Math
  // Clear any existing Elementary Math quizzes first for clean setup
  const existingQuizzes = await prisma.quiz.findMany({
    where: { subjectId: ELEMENTARY_SUBJECT_ID, title: { contains: "គណិតវិទ្យា" } }
  });

  for (const q of existingQuizzes) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: q.quizId } });
    await prisma.quiz.delete({ where: { quizId: q.quizId } });
    console.log(`Cleaned up old quiz: [${q.quizId}] ${q.title}`);
  }

  // For 185 questions, divide into 9 equal quiz cards (~20-21 questions per card)
  const NUM_CARDS = 9;
  const quizChunks = chunkArray(insertedQuestions, NUM_CARDS);

  console.log(`\nCreating ${quizChunks.length} equal quiz cards:`);

  for (let i = 0; i < quizChunks.length; i++) {
    const chunk = quizChunks[i];
    const cardNum = i + 1;

    // Check mixed difficulty
    const diffs = chunk.map(q => q.difficultyLevel || "medium");
    const hasHard = diffs.some(d => d === "hard");
    const diffLabel = hasHard ? "hard" : "medium";

    const title = `គណិតវិទ្យា (ថ្នាក់បឋមសិក្សា) - វិញ្ញាសារទី ${cardNum}`;

    const quiz = await prisma.quiz.create({
      data: {
        subjectId: ELEMENTARY_SUBJECT_ID,
        title,
        difficultyLevel: diffLabel,
        durationMinutes: Math.ceil(chunk.length * 1.5), // ~1.5 mins per question
      }
    });

    await prisma.quizQuestion.createMany({
      data: chunk.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });

    console.log(`  Created Quiz [${quiz.quizId}]: "${title}" (${chunk.length} questions, mixed difficulties)`);
  }

  console.log("\n✅ Elementary Math Quiz Seeding Complete!");
}

main()
  .catch(e => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });


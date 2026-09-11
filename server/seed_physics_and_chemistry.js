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
  if (!arr.length) return [];
  const result = [];
  const chunkSize = Math.ceil(arr.length / numChunks);
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

async function main() {
  console.log("=== Seeding Physics & Chemistry Questions & Quizzes ===\n");

  // 1. Read JSON questions
  const rawQuestions = JSON.parse(fs.readFileSync("./raw_questions.json", "utf8"));
  console.log("Loaded " + rawQuestions.length + " raw questions from JSON file.");

  // 2. Ensure Topics exist
  // Chemistry Secondary (subjectId: 21)
  let chemSecTopic = await prisma.topic.findFirst({
    where: { subjectId: 21, topicName: { contains: "????" } }
  });
  if (!chemSecTopic) {
    chemSecTopic = await prisma.topic.create({
      data: {
        subjectId: 21,
        topicName: "???????? - ??????????????",
        description: "General Chemistry for Secondary Teacher Exam"
      }
    });
  }

  // Chemistry Highschool (subjectId: 31)
  let chemHighTopic = await prisma.topic.findFirst({
    where: { subjectId: 31, topicName: { contains: "????" } }
  });
  if (!chemHighTopic) {
    chemHighTopic = await prisma.topic.create({
      data: {
        subjectId: 31,
        topicName: "???????? - ???????????",
        description: "General Chemistry for Highschool Teacher Exam"
      }
    });
  }

  // Physics Secondary (subjectId: 22)
  let physSecTopic = await prisma.topic.findFirst({
    where: { subjectId: 22 }
  });
  if (!physSecTopic) {
    physSecTopic = await prisma.topic.create({
      data: {
        subjectId: 22,
        topicName: "????????????? - ??????????????",
        description: "General Physics for Secondary Teacher Exam (RTTC)"
      }
    });
    console.log("Created topic for Physics Secondary [ID: " + physSecTopic.topicId + "]");
  } else {
    console.log("Using existing topic for Physics Secondary [ID: " + physSecTopic.topicId + "]");
  }

  // Physics Highschool (subjectId: 25)
  let physHighTopic = await prisma.topic.findFirst({
    where: { subjectId: 25 }
  });
  if (!physHighTopic) {
    physHighTopic = await prisma.topic.create({
      data: {
        subjectId: 25,
        topicName: "????????????? - ???????????",
        description: "General Physics for Highschool Teacher Exam (NIE)"
      }
    });
    console.log("Created topic for Physics Highschool [ID: " + physHighTopic.topicId + "]");
  } else {
    console.log("Using existing topic for Physics Highschool [ID: " + physHighTopic.topicId + "]");
  }

  // 3. Insert questions into DB
  let inserted = 0;
  let skipped = 0;

  for (const q of rawQuestions) {
    const questionText = q.questionText.trim();
    const difficultyLevel = (q.difficultyLevel || "medium").toLowerCase();
    const correctAnswer = q.correctAnswer;
    const explanation = q.explanation || null;
    const referenceNote = q.referenceNote || null;

    let targetTopicId;
    let targetExamName;
    let targetSubjectName;

    const isSecondary = q.examName === "???????????? (????????????)";
    const isHighschool = q.examName === "????????? (????????? / NIE)";

    if (q.subjectName === "Chemistry") {
      targetSubjectName = "Chemistry";
      if (isSecondary) {
        targetExamName = "secondary";
        targetTopicId = chemSecTopic.topicId;
      } else {
        targetExamName = "highschool";
        targetTopicId = chemHighTopic.topicId;
      }
    } else {
      // Physics
      targetSubjectName = "Physics";
      if (isSecondary) {
        targetExamName = "secondary";
        targetTopicId = physSecTopic.topicId;
      } else {
        targetExamName = "highschool";
        targetTopicId = physHighTopic.topicId;
      }
    }

    // Check duplicate
    const exists = await prisma.question.findFirst({
      where: {
        topicId: targetTopicId,
        questionText: questionText
      }
    });

    if (exists) {
      skipped++;
      continue;
    }

    const created = await prisma.question.create({
      data: {
        topicId: targetTopicId,
        examName: targetExamName,
        subjectName: targetSubjectName,
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

    console.log("  [ID: " + created.questionId + "] " + targetSubjectName + " | " + targetExamName + " | " + questionText.substring(0, 45) + "...");
    inserted++;
  }

  console.log("\nInsertion summary: " + inserted + " newly inserted, " + skipped + " skipped/existing.");

  // 4. Create Equal Quiz Cards for Physics
  console.log("\n--- Creating Physics Quizzes ---");

  // Physics Secondary (subjectId: 22)
  const physSecQuestions = await prisma.question.findMany({
    where: { topic: { subjectId: 22 }, examName: "secondary" },
    orderBy: { questionId: "asc" }
  });

  const existingPhysSecQuizzes = await prisma.quiz.findMany({
    where: { subjectId: 22 }
  });
  for (const qz of existingPhysSecQuizzes) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: qz.quizId } });
    await prisma.quiz.delete({ where: { quizId: qz.quizId } });
  }

  // 11 questions -> split into 1 card of 11 questions
  const PHYS_SEC_CARDS = 1;
  const physSecChunks = chunkArray(physSecQuestions, PHYS_SEC_CARDS);

  for (let i = 0; i < physSecChunks.length; i++) {
    const chunk = physSecChunks[i];
    const cardNum = i + 1;
    const diffs = chunk.map(q => q.difficultyLevel || "medium");
    const diffLabel = diffs.some(d => d === "hard") ? "hard" : "medium";
    const title = "????????? (??????????????) - ????? " + cardNum;

    const quiz = await prisma.quiz.create({
      data: {
        subjectId: 22,
        title,
        difficultyLevel: diffLabel,
        durationMinutes: Math.ceil(chunk.length * 1.5)
      }
    });

    await prisma.quizQuestion.createMany({
      data: chunk.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });

    console.log("  Created Secondary Physics Quiz [" + quiz.quizId + "]: \"" + title + "\" (" + chunk.length + " questions)");
  }

  // Physics Highschool (subjectId: 25)
  const physHighQuestions = await prisma.question.findMany({
    where: { topic: { subjectId: 25 }, examName: "highschool" },
    orderBy: { questionId: "asc" }
  });

  const existingPhysHighQuizzes = await prisma.quiz.findMany({
    where: { subjectId: 25 }
  });
  for (const qz of existingPhysHighQuizzes) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: qz.quizId } });
    await prisma.quiz.delete({ where: { quizId: qz.quizId } });
  }

  // 32 questions -> split into 2 equal cards of 16 questions each
  const PHYS_HIGH_CARDS = 2;
  const physHighChunks = chunkArray(physHighQuestions, PHYS_HIGH_CARDS);

  for (let i = 0; i < physHighChunks.length; i++) {
    const chunk = physHighChunks[i];
    const cardNum = i + 1;
    const diffs = chunk.map(q => q.difficultyLevel || "medium");
    const diffLabel = diffs.some(d => d === "hard") ? "hard" : "medium";
    const title = "????????? (???????????) - ????? " + cardNum;

    const quiz = await prisma.quiz.create({
      data: {
        subjectId: 25,
        title,
        difficultyLevel: diffLabel,
        durationMinutes: Math.ceil(chunk.length * 1.5)
      }
    });

    await prisma.quizQuestion.createMany({
      data: chunk.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });

    console.log("  Created Highschool Physics Quiz [" + quiz.quizId + "]: \"" + title + "\" (" + chunk.length + " questions)");
  }

  // 5. Update/Create Chemistry Quizzes to include all questions
  console.log("\n--- Updating Chemistry Quizzes ---");

  // Secondary Chemistry (subjectId: 21)
  const chemSecQuestions = await prisma.question.findMany({
    where: { topic: { subjectId: 21 }, examName: "secondary" },
    orderBy: { questionId: "asc" }
  });

  const existingChemSecQuizzes = await prisma.quiz.findMany({
    where: { subjectId: 21 }
  });
  for (const qz of existingChemSecQuizzes) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: qz.quizId } });
    await prisma.quiz.delete({ where: { quizId: qz.quizId } });
  }

  const CHEM_SEC_CARDS = Math.max(1, Math.ceil(chemSecQuestions.length / 20));
  const chemSecChunks = chunkArray(chemSecQuestions, CHEM_SEC_CARDS);

  for (let i = 0; i < chemSecChunks.length; i++) {
    const chunk = chemSecChunks[i];
    const cardNum = i + 1;
    const diffs = chunk.map(q => q.difficultyLevel || "medium");
    const diffLabel = diffs.some(d => d === "hard") ? "hard" : "medium";
    const title = "?????????? (??????????????) - ????? " + cardNum;

    const quiz = await prisma.quiz.create({
      data: {
        subjectId: 21,
        title,
        difficultyLevel: diffLabel,
        durationMinutes: Math.ceil(chunk.length * 1.5)
      }
    });

    await prisma.quizQuestion.createMany({
      data: chunk.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });

    console.log("  Created Secondary Chemistry Quiz [" + quiz.quizId + "]: \"" + title + "\" (" + chunk.length + " questions)");
  }

  // Highschool Chemistry (subjectId: 31)
  const chemHighQuestions = await prisma.question.findMany({
    where: { topic: { subjectId: 31 }, examName: "highschool" },
    orderBy: { questionId: "asc" }
  });

  const existingChemHighQuizzes = await prisma.quiz.findMany({
    where: { subjectId: 31 }
  });
  for (const qz of existingChemHighQuizzes) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: qz.quizId } });
    await prisma.quiz.delete({ where: { quizId: qz.quizId } });
  }

  const CHEM_HIGH_CARDS = Math.max(1, Math.ceil(chemHighQuestions.length / 20));
  const chemHighChunks = chunkArray(chemHighQuestions, CHEM_HIGH_CARDS);

  for (let i = 0; i < chemHighChunks.length; i++) {
    const chunk = chemHighChunks[i];
    const cardNum = i + 1;
    const diffs = chunk.map(q => q.difficultyLevel || "medium");
    const diffLabel = diffs.some(d => d === "hard") ? "hard" : "medium";
    const title = "?????????? (???????????) - ????? " + cardNum;

    const quiz = await prisma.quiz.create({
      data: {
        subjectId: 31,
        title,
        difficultyLevel: diffLabel,
        durationMinutes: Math.ceil(chunk.length * 1.5)
      }
    });

    await prisma.quizQuestion.createMany({
      data: chunk.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });

    console.log("  Created Highschool Chemistry Quiz [" + quiz.quizId + "]: \"" + title + "\" (" + chunk.length + " questions)");
  }

  console.log("\n? All Physics & Chemistry Questions and Quizzes successfully seeded!");
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

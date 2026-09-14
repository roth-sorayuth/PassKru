import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper: chunk array into groups of size n
function chunkArray(arr, n) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += n) {
    chunks.push(arr.slice(i, i + n));
  }
  return chunks;
}

async function main() {
  console.log("Setting up Chemistry quizzes...\n");

  // ====================================================
  // Get Chemistry questions split by exam_name
  // secondary: subjectId 21 (exam 5 / rttc)
  // highschool: subjectId 31 (exam 6 / nie)
  // ====================================================

  const secondaryQuestions = await prisma.question.findMany({
    where: {
      examName: "secondary",
      topic: { subjectId: 21 }
    },
    orderBy: { questionId: "asc" },
    select: { questionId: true, difficultyLevel: true, questionText: true }
  });

  const highschoolQuestions = await prisma.question.findMany({
    where: {
      examName: "highschool",
      topic: { subjectId: 31 }
    },
    orderBy: { questionId: "asc" },
    select: { questionId: true, difficultyLevel: true, questionText: true }
  });

  console.log(`Secondary Chemistry questions: ${secondaryQuestions.length}`);
  console.log(`Highschool Chemistry questions: ${highschoolQuestions.length}`);

  // ====================================================
  // Create quizzes for secondary Chemistry (subjectId: 21)
  // 51 questions → split into equal cards
  // Target: ~3 quizzes of ~17 questions each
  // ====================================================

  const SECONDARY_SUBJECT_ID = 21;
  const HIGHSCHOOL_SUBJECT_ID = 31;

  // Decide chunk size: aim for ~17-18 questions per card for secondary (51 qs)
  // and ~10 per card for highschool (20 qs) -> 2 cards
  const SECONDARY_CHUNK_SIZE = 17;
  const HIGHSCHOOL_CHUNK_SIZE = 10;

  const secondaryChunks = chunkArray(secondaryQuestions, SECONDARY_CHUNK_SIZE);
  const highschoolChunks = chunkArray(highschoolQuestions, HIGHSCHOOL_CHUNK_SIZE);

  console.log(`\nSecondary: ${secondaryChunks.length} quiz cards, sizes: ${secondaryChunks.map(c => c.length).join(', ')}`);
  console.log(`Highschool: ${highschoolChunks.length} quiz cards, sizes: ${highschoolChunks.map(c => c.length).join(', ')}`);

  // ====================================================
  // Helper: delete existing Chemistry quizzes (clean up)
  // ====================================================
  const existingSecQuizzes = await prisma.quiz.findMany({
    where: { subjectId: SECONDARY_SUBJECT_ID, title: { contains: "គីមី" } }
  });
  const existingHighQuizzes = await prisma.quiz.findMany({
    where: { subjectId: HIGHSCHOOL_SUBJECT_ID, title: { contains: "គីមី" } }
  });

  for (const q of [...existingSecQuizzes, ...existingHighQuizzes]) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: q.quizId } });
    await prisma.quiz.delete({ where: { quizId: q.quizId } });
    console.log(`Deleted old quiz: [${q.quizId}] ${q.title}`);
  }

  // ====================================================
  // Create Secondary Chemistry quizzes
  // ====================================================
  console.log("\n--- Creating Secondary Chemistry Quizzes ---");

  for (let i = 0; i < secondaryChunks.length; i++) {
    const chunk = secondaryChunks[i];
    const cardNum = i + 1;

    // Determine difficulty label based on mixed difficulties in this chunk
    const difficulties = chunk.map(q => q.difficultyLevel || "medium");
    const hasHard = difficulties.some(d => d === "hard");
    const hasMedium = difficulties.some(d => d === "medium");
    const difficultyLabel = hasHard ? "hard" : hasMedium ? "medium" : "easy";

    const title = `គីមីវិទ្យា (ថ្នាក់មូលដ្ឋាន) - វិញ្ញាសារទី ${cardNum}`;

    const quiz = await prisma.quiz.create({
      data: {
        subjectId: SECONDARY_SUBJECT_ID,
        title,
        difficultyLevel: difficultyLabel,
        durationMinutes: Math.ceil(chunk.length * 1.5), // ~1.5 min per question
      }
    });

    // Link questions to quiz
    await prisma.quizQuestion.createMany({
      data: chunk.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });

    console.log(`  Created: [${quiz.quizId}] "${title}" (${chunk.length} questions, difficulty: ${difficultyLabel})`);
  }

  // ====================================================
  // Create Highschool Chemistry quizzes
  // ====================================================
  console.log("\n--- Creating Highschool Chemistry Quizzes ---");

  for (let i = 0; i < highschoolChunks.length; i++) {
    const chunk = highschoolChunks[i];
    const cardNum = i + 1;

    const difficulties = chunk.map(q => q.difficultyLevel || "medium");
    const hasHard = difficulties.some(d => d === "hard");
    const hasMedium = difficulties.some(d => d === "medium");
    const difficultyLabel = hasHard ? "hard" : hasMedium ? "medium" : "easy";

    const title = `គីមីវិទ្យា (ថ្នាក់ឧត្តម) - វិញ្ញាសារទី ${cardNum}`;

    const quiz = await prisma.quiz.create({
      data: {
        subjectId: HIGHSCHOOL_SUBJECT_ID,
        title,
        difficultyLevel: difficultyLabel,
        durationMinutes: Math.ceil(chunk.length * 1.5),
      }
    });

    await prisma.quizQuestion.createMany({
      data: chunk.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });

    console.log(`  Created: [${quiz.quizId}] "${title}" (${chunk.length} questions, difficulty: ${difficultyLabel})`);
  }

  // ====================================================
  // Summary
  // ====================================================
  const totalSecondaryQuizzes = secondaryChunks.length;
  const totalHighschoolQuizzes = highschoolChunks.length;
  const totalQuizzes = totalSecondaryQuizzes + totalHighschoolQuizzes;
  const totalQuestionsLinked = secondaryQuestions.length + highschoolQuestions.length;

  console.log(`\n✅ Done!`);
  console.log(`   Secondary Chemistry (rttc): ${totalSecondaryQuizzes} quiz cards`);
  console.log(`   Highschool Chemistry (nie): ${totalHighschoolQuizzes} quiz cards`);
  console.log(`   Total quizzes created: ${totalQuizzes}`);
  console.log(`   Total questions linked: ${totalQuestionsLinked}`);
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

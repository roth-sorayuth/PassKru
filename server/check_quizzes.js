import { prisma } from './src/config/prisma.js';

async function main() {
  const quizzes = await prisma.quiz.findMany({
    include: { quizQuestions: true }
  });
  console.log(`Total Quizzes in DB: ${quizzes.length}`);
  let non20Count = 0;
  for (const q of quizzes) {
    if (q.quizQuestions.length !== 20) {
      non20Count++;
      console.log(`Quiz ID ${q.quizId}: "${q.title}" -> ${q.quizQuestions.length} questions`);
    }
  }
  console.log(`Summary: ${non20Count} out of ${quizzes.length} quizzes do NOT have 20 questions.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

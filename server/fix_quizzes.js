import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

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
  console.log('=== Updating Physics & Chemistry Quiz Cards ===\n');

  // 1. Physics Secondary (subjectId: 22)
  const physSecQuestions = await prisma.question.findMany({
    where: { topic: { subjectId: 22 }, examName: 'secondary' },
    orderBy: { questionId: 'asc' }
  });
  console.log('Secondary Physics questions count:', physSecQuestions.length);

  const existingPhysSecQuizzes = await prisma.quiz.findMany({ where: { subjectId: 22 } });
  for (const qz of existingPhysSecQuizzes) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: qz.quizId } });
    try {
      await prisma.quiz.delete({ where: { quizId: qz.quizId } });
    } catch (e) {
      console.log('Could not delete quiz', qz.quizId, e.message);
    }
  }

  if (physSecQuestions.length > 0) {
    const title = '????????? (??????????????) - ????? 1';
    const diffs = physSecQuestions.map(q => q.difficultyLevel || 'medium');
    const diffLabel = diffs.some(d => d === 'hard') ? 'hard' : 'medium';

    const quiz = await prisma.quiz.create({
      data: {
        subjectId: 22,
        title,
        difficultyLevel: diffLabel,
        durationMinutes: Math.ceil(physSecQuestions.length * 1.5)
      }
    });

    await prisma.quizQuestion.createMany({
      data: physSecQuestions.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });
    console.log('Created Secondary Physics Quiz [' + quiz.quizId + ']: "' + title + '" (' + physSecQuestions.length + ' questions)');
  }

  // 2. Physics Highschool (subjectId: 25)
  const physHighQuestions = await prisma.question.findMany({
    where: { topic: { subjectId: 25 }, examName: 'highschool' },
    orderBy: { questionId: 'asc' }
  });
  console.log('Highschool Physics questions count:', physHighQuestions.length);

  const existingPhysHighQuizzes = await prisma.quiz.findMany({ where: { subjectId: 25 } });
  for (const qz of existingPhysHighQuizzes) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: qz.quizId } });
    try {
      await prisma.quiz.delete({ where: { quizId: qz.quizId } });
    } catch (e) {
      console.log('Could not delete quiz', qz.quizId, e.message);
    }
  }

  if (physHighQuestions.length > 0) {
    const chunks = chunkArray(physHighQuestions, 2);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const cardNum = i + 1;
      const title = '????????? (???????????) - ????? ' + cardNum;
      const diffs = chunk.map(q => q.difficultyLevel || 'medium');
      const diffLabel = diffs.some(d => d === 'hard') ? 'hard' : 'medium';

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
      console.log('Created Highschool Physics Quiz [' + quiz.quizId + ']: "' + title + '" (' + chunk.length + ' questions)');
    }
  }

  // 3. Secondary Chemistry (subjectId: 21)
  const chemSecQuestions = await prisma.question.findMany({
    where: { topic: { subjectId: 21 }, examName: 'secondary' },
    orderBy: { questionId: 'asc' }
  });
  console.log('Secondary Chemistry questions count:', chemSecQuestions.length);

  const existingChemSecQuizzes = await prisma.quiz.findMany({ where: { subjectId: 21 } });
  for (const qz of existingChemSecQuizzes) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: qz.quizId } });
  }

  const chemSecChunks = chunkArray(chemSecQuestions, 5);
  for (let i = 0; i < chemSecChunks.length; i++) {
    const chunk = chemSecChunks[i];
    const cardNum = i + 1;
    const title = '?????????? (??????????????) - ????? ' + cardNum;
    const diffs = chunk.map(q => q.difficultyLevel || 'medium');
    const diffLabel = diffs.some(d => d === 'hard') ? 'hard' : 'medium';

    let quiz;
    if (i < existingChemSecQuizzes.length) {
      quiz = await prisma.quiz.update({
        where: { quizId: existingChemSecQuizzes[i].quizId },
        data: {
          title,
          difficultyLevel: diffLabel,
          durationMinutes: Math.ceil(chunk.length * 1.5)
        }
      });
    } else {
      quiz = await prisma.quiz.create({
        data: {
          subjectId: 21,
          title,
          difficultyLevel: diffLabel,
          durationMinutes: Math.ceil(chunk.length * 1.5)
        }
      });
    }

    await prisma.quizQuestion.createMany({
      data: chunk.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });
    console.log('Setup Secondary Chemistry Quiz [' + quiz.quizId + ']: "' + title + '" (' + chunk.length + ' questions)');
  }

  // 4. Highschool Chemistry (subjectId: 31)
  const chemHighQuestions = await prisma.question.findMany({
    where: { topic: { subjectId: 31 }, examName: 'highschool' },
    orderBy: { questionId: 'asc' }
  });
  console.log('Highschool Chemistry questions count:', chemHighQuestions.length);

  const existingChemHighQuizzes = await prisma.quiz.findMany({ where: { subjectId: 31 } });
  for (const qz of existingChemHighQuizzes) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: qz.quizId } });
  }

  const chemHighChunks = chunkArray(chemHighQuestions, 2);
  for (let i = 0; i < chemHighChunks.length; i++) {
    const chunk = chemHighChunks[i];
    const cardNum = i + 1;
    const title = '?????????? (???????????) - ????? ' + cardNum;
    const diffs = chunk.map(q => q.difficultyLevel || 'medium');
    const diffLabel = diffs.some(d => d === 'hard') ? 'hard' : 'medium';

    let quiz;
    if (i < existingChemHighQuizzes.length) {
      quiz = await prisma.quiz.update({
        where: { quizId: existingChemHighQuizzes[i].quizId },
        data: {
          title,
          difficultyLevel: diffLabel,
          durationMinutes: Math.ceil(chunk.length * 1.5)
        }
      });
    } else {
      quiz = await prisma.quiz.create({
        data: {
          subjectId: 31,
          title,
          difficultyLevel: diffLabel,
          durationMinutes: Math.ceil(chunk.length * 1.5)
        }
      });
    }

    await prisma.quizQuestion.createMany({
      data: chunk.map((q, idx) => ({
        quizId: quiz.quizId,
        questionId: q.questionId,
        questionOrder: idx + 1
      }))
    });
    console.log('Setup Highschool Chemistry Quiz [' + quiz.quizId + ']: "' + title + '" (' + chunk.length + ' questions)');
  }

  console.log('\n? Quizzes set up successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

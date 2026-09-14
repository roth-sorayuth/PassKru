import fs from 'fs';
import { prisma } from './src/config/prisma.js';

async function main() {
  console.log('=== Starting General Knowledge (Teacher Ethics) Seeding ===');

  const rawQuestions = JSON.parse(fs.readFileSync('d:/passkru/PassKru/server/all_gk_questions_final.json', 'utf8'));
  console.log(`Loaded ${rawQuestions.length} General Knowledge questions.`);

  // 1. Get current max questionId
  const maxQ = await prisma.question.aggregate({ _max: { questionId: true } });
  let nextQuestionId = (maxQ._max.questionId || 0) + 1;
  console.log(`Starting question insertion at ID: ${nextQuestionId}`);

  // 2. Ensure Topic "ក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន" exists
  let topic = await prisma.topic.findFirst({
    where: {
      topicName: { contains: 'ក្រមសីលធម៌' }
    }
  });

  if (!topic) {
    topic = await prisma.topic.create({
      data: {
        subjectId: 14, // High school GK subjectId
        topicName: 'ក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន',
        description: 'សំណួរក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន (Teacher Professional Code of Ethics)'
      }
    });
    console.log(`Created topic: ${topic.topicName} (ID: ${topic.topicId})`);
  } else {
    console.log(`Using existing topic: ${topic.topicName} (ID: ${topic.topicId})`);
  }

  // Also ensure topics exist for Elementary (4), Secondary (9), Shared (19) for completeness
  const targetSubjects = [4, 9, 14, 19];
  for (const sId of targetSubjects) {
    const existingTop = await prisma.topic.findFirst({
      where: { subjectId: sId, topicName: 'ក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន' }
    });
    if (!existingTop) {
      await prisma.topic.create({
        data: {
          subjectId: sId,
          topicName: 'ក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន',
          description: 'សំណួរក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន'
        }
      });
    }
  }

  // 3. Insert questions
  const insertedQuestions = [];

  for (const item of rawQuestions) {
    const qId = nextQuestionId++;

    const createdQ = await prisma.question.create({
      data: {
        questionId: qId,
        topicId: topic.topicId,
        examName: 'all',
        subjectName: 'General Knowledge',
        questionText: item.questionText,
        questionType: item.questionType || 'Multiple Choice',
        difficultyLevel: (item.difficultyLevel || 'Medium').toLowerCase(),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        referenceNote: item.referenceNote || 'វិញ្ញាសាក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន',
        answerOptions: {
          create: item.options.map(opt => ({
            optionText: opt.text,
            isCorrect: opt.isCorrect
          }))
        }
      }
    });

    insertedQuestions.push(createdQ);
    console.log(`  [Inserted Q ID: ${qId}] ${createdQ.questionText.substring(0, 40)}...`);
  }

  console.log(`\nSuccessfully inserted ${insertedQuestions.length} GK questions (IDs: ${insertedQuestions[0].questionId} to ${insertedQuestions[insertedQuestions.length - 1].questionId})`);

  // 4. Create 4 Quiz Cards for Elementary (4), Secondary (9), High School (14), and General (19)
  console.log('\n--- Creating Quiz Cards across Categories ---');

  const cardTitles = [
    'ក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន - ឈុតទី 1',
    'ក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន - ឈុតទី 2',
    'ក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន - ឈុតទី 3',
    'ក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀន - ឈុតទី 4'
  ];

  const questionsPerCard = Math.ceil(insertedQuestions.length / 4); // 17 questions per card

  for (const subId of [4, 9, 14, 19]) {
    console.log(`\nCreating Quiz Cards for Subject ID: ${subId}`);
    for (let i = 0; i < 4; i++) {
      const title = cardTitles[i];
      const cardQuestions = insertedQuestions.slice(i * questionsPerCard, (i + 1) * questionsPerCard);
      if (cardQuestions.length === 0) continue;

      const quiz = await prisma.quiz.create({
        data: {
          subjectId: subId,
          title: title,
          difficultyLevel: 'medium',
          durationMinutes: 30,
          quizQuestions: {
            create: cardQuestions.map((q, idx) => ({
              questionId: q.questionId,
              questionOrder: idx + 1
            }))
          }
        }
      });

      console.log(`  Created Quiz [ID: ${quiz.quizId}] for Subject ${subId}: "${quiz.title}" (${cardQuestions.length} questions)`);
    }
  }

  console.log('\n=== Seeding General Knowledge Completed Successfully! ===');
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


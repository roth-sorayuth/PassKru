import fs from 'fs';
import { prisma } from './src/config/prisma.js';

async function main() {
  console.log('=== Starting Cambodian History (General Knowledge) Seeding ===');

  const rawQuestions = JSON.parse(
    fs.readFileSync('d:/passkru/PassKru/server/cambodian_history_questions_extracted.json', 'utf8')
  );
  console.log(`Loaded ${rawQuestions.length} Cambodian History questions.`);

  // 1. Get current max questionId
  const maxQ = await prisma.question.aggregate({ _max: { questionId: true } });
  let nextQuestionId = (maxQ._max.questionId || 0) + 1;
  console.log(`Starting question insertion at ID: ${nextQuestionId}`);

  // 2. Ensure Topic "ប្រវត្តិសាស្ត្រកម្ពុជា" exists for relevant subjects (4, 9, 14, 19)
  const targetSubjects = [4, 9, 14, 19];
  let primaryTopic = null;

  for (const sId of targetSubjects) {
    let top = await prisma.topic.findFirst({
      where: { subjectId: sId, topicName: 'ប្រវត្តិសាស្ត្រកម្ពុជា' }
    });
    if (!top) {
      top = await prisma.topic.create({
        data: {
          subjectId: sId,
          topicName: 'ប្រវត្តិសាស្ត្រកម្ពុជា',
          description: 'សំណួរប្រវត្តិសាស្ត្រកម្ពុជា (Cambodian History General Knowledge)'
        }
      });
      console.log(`Created topic for Subject ${sId}: ${top.topicName} (ID: ${top.topicId})`);
    } else {
      console.log(`Using existing topic for Subject ${sId}: ${top.topicName} (ID: ${top.topicId})`);
    }
    if (sId === 14) {
      primaryTopic = top;
    }
  }

  if (!primaryTopic) {
    primaryTopic = await prisma.topic.findFirst({
      where: { topicName: 'ប្រវត្តិសាស្ត្រកម្ពុជា' }
    });
  }

  // 3. Insert questions
  const insertedQuestions = [];

  for (const item of rawQuestions) {
    const qId = nextQuestionId++;

    const createdQ = await prisma.question.create({
      data: {
        questionId: qId,
        topicId: primaryTopic.topicId,
        examName: 'all',
        subjectName: 'General Knowledge',
        questionText: item.questionText,
        questionType: item.questionType || 'Multiple Choice',
        difficultyLevel: (item.difficultyLevel || 'Medium').toLowerCase(),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        referenceNote: item.referenceNote || 'វិញ្ញាសាប្រវត្តិសាស្ត្រកម្ពុជា',
        answerOptions: {
          create: item.options.map(opt => ({
            optionText: opt.text,
            isCorrect: opt.isCorrect
          }))
        }
      }
    });

    insertedQuestions.push(createdQ);
    console.log(`  [Inserted Q ID: ${qId}] ${createdQ.questionText.substring(0, 45)}...`);
  }

  console.log(
    `\nSuccessfully inserted ${insertedQuestions.length} Cambodian History questions (IDs: ${insertedQuestions[0].questionId} to ${insertedQuestions[insertedQuestions.length - 1].questionId})`
  );

  // 4. Create 4 Quiz Cards for Elementary (4), Secondary (9), High School (14), and Shared (19)
  console.log('\n--- Creating Quiz Cards across Categories ---');

  const cardTitles = [
    'ប្រវត្តិសាស្ត្រកម្ពុជា - ឈុតទី 1',
    'ប្រវត្តិសាស្ត្រកម្ពុជា - ឈុតទី 2',
    'ប្រវត្តិសាស្ត្រកម្ពុជា - ឈុតទី 3',
    'ប្រវត្តិសាស្ត្រកម្ពុជា - ឈុតទី 4'
  ];

  const questionsPerCard = 15; // 60 questions / 4 cards = 15 per card

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

      console.log(
        `  Created Quiz [ID: ${quiz.quizId}] for Subject ${subId}: "${quiz.title}" (${cardQuestions.length} questions)`
      );
    }
  }

  console.log('\n=== Seeding Cambodian History General Knowledge Completed Successfully! ===');
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


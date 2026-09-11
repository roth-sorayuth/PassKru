import { prisma } from './src/config/prisma.js';

async function main() {
  const result = await prisma.question.updateMany({
    data: { examName: 'all' }
  });
  console.log('Updated', result.count, 'questions to exam_name = "all"');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

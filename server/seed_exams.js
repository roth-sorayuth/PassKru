import { prisma } from './src/config/prisma.js';

async function main() {
  const exams = await prisma.exam.findMany({
    where: {
      examName: {
        in: ['Elementary Exam', 'Secondary Exam', 'High School Exam']
      }
    }
  });

  const subjects = ["Mathematics", "Khmer", "Physics", "Chemistry", "Biology", "Pedagogy"];

  for (const exam of exams) {
    // Delete the temporary dummy subjects we created earlier
    await prisma.subject.deleteMany({
      where: {
        examId: exam.examId,
        subjectName: { contains: "General" }
      }
    });

    for (const sub of subjects) {
      const exists = await prisma.subject.findFirst({
        where: { examId: exam.examId, subjectName: sub }
      });
      if (!exists) {
        await prisma.subject.create({
          data: {
            examId: exam.examId,
            subjectName: sub,
            description: `${sub} for ${exam.examName}`
          }
        });
        console.log(`Created ${sub} for ${exam.examName}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

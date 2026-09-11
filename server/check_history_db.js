import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== Finding History Subjects & Max Question ID ===");

  const subjects = await prisma.subject.findMany({
    where: {
      OR: [
        { subjectName: { contains: "History", mode: "insensitive" } },
        { subjectName: { contains: "ប្រវត្តិ", mode: "insensitive" } }
      ]
    },
    include: { exam: true, topics: true, quizzes: true }
  });

  for (const s of subjects) {
    console.log(`Subject ID: ${s.subjectId} | Name: "${s.subjectName}" | Exam: ${s.exam?.examName} (${s.exam?.targetCode})`);
    console.log(`  Topics (${s.topics.length}):`, s.topics.map(t => `[${t.topicId}: ${t.topicName}]`).join(", "));
    console.log(`  Quizzes (${s.quizzes.length}):`, s.quizzes.map(q => `[${q.quizId}: ${q.title}]`).join(", "));
  }

  const allSubjects = await prisma.subject.findMany({
    include: { exam: true }
  });
  console.log("\n--- All Subjects ---");
  for (const s of allSubjects) {
    console.log(`ID ${s.subjectId}: "${s.subjectName}" | Exam ID ${s.examId} (${s.exam?.targetCode})`);
  }

  const maxQ = await prisma.question.aggregate({ _max: { questionId: true } });
  console.log(`\nMax Question ID currently in DB: ${maxQ._max.questionId}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

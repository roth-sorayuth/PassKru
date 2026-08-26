import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import { usersData } from "./data/usersData.js";
import { announcementsData } from "./data/announcementsData.js";
import { subjectsData } from "./data/subjectsData.js";
import { papersData } from "./data/papersData.js";
import { topicsData } from "./data/topicsData.js";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedExams() {
  console.log("Seeding exams...");
  for (const id of [1, 2, 3]) {
    const exists = await prisma.exam.findUnique({ where: { examId: id } });
    if (!exists) {
      await prisma.exam.create({
        data: {
          examId: id,
          examName: id === 1 
            ? "ប្រឡងប្រជែងជ្រើសរើសគ្រូបង្រៀនថ្នាក់លើកកម្រិតបឋមសិក្សា" 
            : `ប្រឡងគ្រូបង្រៀន កម្រិត ${id}`,
          category: "បឋមសិក្សា",
        }
      });
      console.log(`Created Exam record with ID: ${id}`);
    }
  }
}

async function seedUsers() {
  console.log("Clearing existing users...");
  await prisma.user.deleteMany({});
  
  console.log("Seeding users...");
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user: ${user.firstName} ${user.lastName} (${user.email})`);
  }
}

async function seedAnnouncements() {
  console.log("Clearing existing announcements...");
  await prisma.announcement.deleteMany({});

  // Ensure exam placeholder exists
  let exam = await prisma.exam.findFirst();
  if (!exam) {
    exam = await prisma.exam.create({
      data: {
        examId: 1,
        examName: "ប្រឡងប្រជែងជ្រើសរើសគ្រូបង្រៀនថ្នាក់លើកកម្រិតបឋមសិក្សា",
        category: "បឋមសិក្សា",
      },
    });
    console.log(`Created default exam with ID: ${exam.examId}`);
  }

  console.log("Seeding announcements...");
  for (const a of announcementsData) {
    const announcement = await prisma.announcement.create({
      data: {
        ...a,
        examId: exam.examId,
      }
    });
    console.log(`Created announcement: ${announcement.title}`);
  }
}

async function seedSubjects() {
  console.log("Clearing existing subjects...");
  // Will cascade delete topics and papers
  await prisma.subject.deleteMany({});

  console.log("Seeding subjects...");
  for (const s of subjectsData) {
    const subject = await prisma.subject.create({
      data: s,
    });
    console.log(`Created subject: ${subject.subjectName} (ID: ${subject.subjectId})`);
  }
}

async function seedPapers() {
  console.log("Clearing existing past papers...");
  await prisma.pastPaper.deleteMany({});

  console.log("Seeding past papers...");
  for (const p of papersData) {
    const paper = await prisma.pastPaper.create({
      data: p,
    });
    console.log(`Created past paper: ${paper.title} (ID: ${paper.paperId})`);
  }
}

async function seedTopics() {
  console.log("Clearing existing topics...");
  // Clear topics reading relations
  await prisma.topic.deleteMany({});

  console.log("Seeding topics...");
  for (const t of topicsData) {
    const topic = await prisma.topic.create({
      data: t,
    });
    console.log(`Created topic: ${topic.topicName} (ID: ${topic.topicId})`);
  }
}

async function main() {
  const target = process.argv[2]?.toLowerCase();
  
  console.log("Seeding started...");

  if (!target) {
    // Seed everything in dependency order
    await seedExams();
    await seedUsers();
    await seedAnnouncements();
    await seedSubjects();
    await seedTopics();
    await seedPapers();
  } else if (target === "exams") {
    await seedExams();
  } else if (target === "users") {
    await seedExams();
    await seedUsers();
  } else if (target === "announcements") {
    await seedExams();
    await seedAnnouncements();
  } else if (target === "subjects") {
    await seedExams();
    await seedSubjects();
  } else if (target === "topics") {
    await seedExams();
    await seedSubjects();
    await seedTopics();
  } else if (target === "papers") {
    await seedExams();
    await seedSubjects();
    await seedPapers();
  } else {
    console.error(`Unknown seed target: "${target}". Use "exams", "users", "announcements", "subjects", "topics", or "papers".`);
    process.exit(1);
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

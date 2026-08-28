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

// Helper to convert camelCase object keys to snake_case to match the Prisma schema fields
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function mapToSnakeCase(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(mapToSnakeCase);
  
  const newObj = {};
  for (const key in obj) {
    newObj[toSnakeCase(key)] = mapToSnakeCase(obj[key]);
  }
  return newObj;
}

async function seedExams() {
  console.log("Seeding exams...");
  for (const id of [1, 2, 3]) {
    const exists = await prisma.exam.findFirst({
      where: { exam_id: id }
    });
    if (!exists) {
      await prisma.exam.create({
        data: {
          exam_id: id,
          exam_name: id === 1 
            ? "ប្រឡងប្រជែងជ្រើសរើសគ្រូបង្រៀនថ្នាក់លើកកម្រិតបឋមសិក្សា" 
            : `ប្រឡងគ្រូបង្រៀន កម្រិត ${id}`,
          category: "បឋមសិក្សា",
        }
      });
      console.log(`Created Exam record with ID: ${id}`);
    } else {
      console.log(`Exam with ID ${id} already exists. Skipping.`);
    }
  }
}

async function seedUsers() {
  console.log("Seeding users...");
  for (const u of usersData) {
    const snakeUser = mapToSnakeCase(u);
    const exists = await prisma.user.findUnique({
      where: { email: snakeUser.email }
    });
    if (!exists) {
      const user = await prisma.user.create({
        data: snakeUser,
      });
      console.log(`Created user: ${user.firstName} ${user.lastName} (${user.email})`);
    } else {
      console.log(`User ${snakeUser.email} already exists. Skipping.`);
    }
  }
}

async function seedAnnouncements() {
  let exam = await prisma.exam.findFirst();
  if (!exam) {
    exam = await prisma.exam.create({
      data: {
        exam_id: 1,
        exam_name: "ប្រឡងប្រជែងជ្រើសរើសគ្រូបង្រៀនថ្នាក់លើកកម្រិតបឋមសិក្សា",
        category: "បឋមសិក្សា",
      },
    });
    console.log(`Created default exam with ID: ${exam.exam_id}`);
  }

  console.log("Seeding announcements...");
  for (const a of announcementsData) {
    const snakeAnnouncement = mapToSnakeCase(a);
    const exists = await prisma.announcement.findFirst({
      where: { title: snakeAnnouncement.title }
    });
    if (!exists) {
      const announcement = await prisma.announcement.create({
        data: {
          ...snakeAnnouncement,
          exam_id: exam.exam_id,
        }
      });
      console.log(`Created announcement: ${announcement.title}`);
    } else {
      console.log(`Announcement "${snakeAnnouncement.title}" already exists. Skipping.`);
    }
  }
}

async function seedSubjects() {
  console.log("Seeding subjects...");
  for (const s of subjectsData) {
    const snakeSubject = mapToSnakeCase(s);
    const exists = await prisma.subject.findFirst({
      where: {
        exam_id: snakeSubject.exam_id,
        subject_name: snakeSubject.subject_name
      }
    });
    if (!exists) {
      const subject = await prisma.subject.create({
        data: snakeSubject,
      });
      console.log(`Created subject: ${subject.subject_name} (ID: ${subject.subject_id})`);
    } else {
      console.log(`Subject "${snakeSubject.subject_name}" already exists for Exam ID ${snakeSubject.exam_id}. Skipping.`);
    }
  }
}

async function seedPapers() {
  console.log("Seeding past papers...");
  for (const p of papersData) {
    const snakePaper = mapToSnakeCase(p);
    const exists = await prisma.past_paper.findFirst({
      where: {
        subject_id: snakePaper.subject_id,
        title: snakePaper.title
      }
    });
    if (!exists) {
      const paper = await prisma.past_paper.create({
        data: snakePaper,
      });
      console.log(`Created past paper: ${paper.title} (ID: ${paper.paper_id})`);
    } else {
      console.log(`Past paper "${snakePaper.title}" already exists. Skipping.`);
    }
  }
}

async function seedTopics() {
  console.log("Seeding topics...");
  for (const t of topicsData) {
    const snakeTopic = mapToSnakeCase(t);
    const exists = await prisma.topic.findFirst({
      where: {
        subject_id: snakeTopic.subject_id,
        topic_name: snakeTopic.topic_name
      }
    });
    if (!exists) {
      const topic = await prisma.topic.create({
        data: snakeTopic,
      });
      console.log(`Created topic: ${topic.topic_name} (ID: ${topic.topic_id})`);
    } else {
      console.log(`Topic "${snakeTopic.topic_name}" already exists. Skipping.`);
    }
  }
}

async function main() {
  const target = process.argv[2]?.toLowerCase();
  
  console.log("Seeding started...");

  if (!target) {
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

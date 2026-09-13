import { prisma } from "./src/config/prisma.js";

async function main() {
  console.log("Updating DB schema for flashcard table...");
  
  // Add subject_name column to flashcard table if not exists
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "flashcard" ADD COLUMN IF NOT EXISTS "subject_name" VARCHAR(150);
  `);
  console.log("Column 'subject_name' added or verified on 'flashcard' table.");

  // Populate subject_name in flashcard table from flashcard_deck
  const updatedCount = await prisma.$executeRawUnsafe(`
    UPDATE "flashcard" f
    SET "subject_name" = d."subject_name"
    FROM "flashcard_deck" d
    WHERE f."deck_id" = d."deck_id";
  `);
  console.log(`Updated subject_name for ${updatedCount} flashcard rows.`);

  // If any flashcard deck still didn't have subject_name, fallback from subject table
  const fallbackCount = await prisma.$executeRawUnsafe(`
    UPDATE "flashcard" f
    SET "subject_name" = s."subject_name"
    FROM "flashcard_deck" d
    JOIN "subject" s ON d."subject_id" = s."subject_id"
    WHERE f."deck_id" = d."deck_id" AND (f."subject_name" IS NULL OR f."subject_name" = '');
  `);
  console.log(`Fallback updated subject_name for ${fallbackCount} flashcard rows.`);

  console.log("Done updating flashcard DB.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


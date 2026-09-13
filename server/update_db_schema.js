import { prisma } from "./src/config/prisma.js";

async function main() {
  console.log("Adding subject_name column to flashcard_deck table if not exists...");
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "flashcard_deck" ADD COLUMN IF NOT EXISTS "subject_name" VARCHAR(150);`
  );
  console.log("Column added.");

  console.log("Populating subject_name for all decks in database...");
  const decks = await prisma.flashcardDeck.findMany({
    include: { subject: true },
  });

  let count = 0;
  for (const d of decks) {
    const sName = d.subject?.subjectName || "គណិតវិទ្យា";
    await prisma.$executeRawUnsafe(
      `UPDATE "flashcard_deck" SET "subject_name" = $1 WHERE "deck_id" = $2`,
      sName,
      d.deckId
    );
    count++;
  }

  console.log(`Successfully updated subject_name for ${count} decks in database!`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error updating schema and filling decks:", err);
    process.exit(1);
  });


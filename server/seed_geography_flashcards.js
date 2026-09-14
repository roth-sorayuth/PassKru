import { prisma } from "./src/config/prisma.js";
import { GEOGRAPHY_FLASHCARDS_DATA } from "./prisma/data/geographyFlashcardsData.js";

const DIFFICULTY_MAP = {
  "Easy": "easy",
  "Medium": "medium",
  "Hard": "hard",
  "ងាយ": "easy",
  "ងាយស្រួល": "easy",
  "មធ្យម": "medium",
  "ពិបាក": "hard",
  "easy": "easy",
  "medium": "medium",
  "hard": "hard",
};

const DECKS_CONFIG = [
  { deckId: 701, title: "វិញ្ញាសារទី ១: ភូមិវិទ្យាកម្ពុជា & ពិភពលោក - មូលដ្ឋាន", description: "ព្រំប្រទល់កម្ពុជា បឹងទន្លេសាប ទ្វីប និងមហាសមុទ្រ" },
  { deckId: 702, title: "វិញ្ញាសារទី ២: ភូមិសាស្ត្រ & អាកាសធាតុ", description: "រដូវកាល ដីស្រែបាត់ដំបង និងលក្ខណៈអាកាសធាតុ" },
  { deckId: 703, title: "វិញ្ញាសារទី ៣: ធនធានធម្មជាតិ & កោះកម្ពុជា", description: "កោះទ្រង់ ភ្នំគូលែន ស្ពានគីហ្សូណា និងបឹងយក្សឡោម" },
  { deckId: 704, title: "វិញ្ញាសារទី ៤: ភូមិវិទ្យាអន្តរជាតិ & ឧទ្យានជាតិ", description: "ចតុមុខ ឧទ្យានជាតិបូកគោ ព្រែកជីកប៉ាណាម៉ា និងជួរភ្នំអ៊ូរ៉ាល់" },
  { deckId: 705, title: "វិញ្ញាសារទី ៥: កសិកម្ម & ភូមិសាស្ត្រតំបន់", description: "ច្រកប៉ោយប៉ែត ទន្លេអាម៉ាហ្សូន ខេត្តមណ្ឌលគីរី និងខ្សែរយៈទទឹង-បណ្តោយ" },
];

async function seedGeographyFlashcards() {
  console.log("Seeding 5 Geography Decks and 50 Flashcards into Database...");

  // 1. Find or create Geography subject
  let geographySubject = await prisma.subject.findFirst({
    where: {
      OR: [
        { subjectName: "ភូមិវិទ្យា" },
        { subjectName: "ភូមិសាស្ត្រ" }
      ]
    },
  });

  const subjectTitle = geographySubject ? geographySubject.subjectName : "ភូមិវិទ្យា";

  if (!geographySubject) {
    geographySubject = await prisma.subject.create({
      data: {
        subjectName: subjectTitle,
        description: "មុខវិជ្ជាភូមិវិទ្យាកម្ពុជា និងភូមិវិទ្យាពិភពលោក",
      },
    });
    console.log(`Created Geography subject with ID: ${geographySubject.subjectId}`);
  }

  // 2. Create/upsert the 5 FlashcardDecks (701 to 705)
  for (const cfg of DECKS_CONFIG) {
    await prisma.flashcardDeck.upsert({
      where: { deckId: cfg.deckId },
      update: {
        subjectId: geographySubject.subjectId,
        subjectName: subjectTitle,
        title: cfg.title,
        description: cfg.description,
      },
      create: {
        deckId: cfg.deckId,
        subjectId: geographySubject.subjectId,
        subjectName: subjectTitle,
        title: cfg.title,
        description: cfg.description,
      },
    });
  }
  console.log("5 Flashcard Decks (701-705) created/updated successfully.");

  // 3. Upsert/insert all 50 flashcards, dividing 10 cards per deck (deck 701 to 705)
  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < GEOGRAPHY_FLASHCARDS_DATA.length; i++) {
    const cardData = GEOGRAPHY_FLASHCARDS_DATA[i];
    const mappedDifficulty = DIFFICULTY_MAP[cardData.difficulty] || "medium";
    
    // Assign 10 cards to each deck (Cards 1-10 -> deck 701, Cards 11-20 -> deck 702, etc.)
    const deckId = 701 + Math.floor(i / 10);
    // Shift flashcard_id by 900 to avoid conflicts (Math: 1-100, Phys: 101-200, Chem: 201-299, GK: 301-500, Khmer: 501-700, History: 701-900, Geo: 901-950)
    const flashcardId = 900 + cardData.flashcard_id;

    const existingCard = await prisma.flashcard.findUnique({
      where: { flashcardId },
    });

    if (existingCard) {
      await prisma.flashcard.update({
        where: { flashcardId },
        data: {
          deckId,
          subjectName: subjectTitle,
          category: cardData.category,
          frontText: cardData.front_text,
          backText: cardData.back_text,
          hint: cardData.hint,
          difficulty: mappedDifficulty,
        },
      });
      updatedCount++;
    } else {
      await prisma.flashcard.create({
        data: {
          flashcardId,
          deckId,
          subjectName: subjectTitle,
          category: cardData.category,
          frontText: cardData.front_text,
          backText: cardData.back_text,
          hint: cardData.hint,
          difficulty: mappedDifficulty,
        },
      });
      insertedCount++;
    }
  }

  console.log(`Successfully processed flashcards: ${insertedCount} inserted, ${updatedCount} updated across 5 decks.`);

  // Update Postgres Sequences so future auto-increments work smoothly
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('flashcard', 'flashcard_id'), COALESCE((SELECT MAX(flashcard_id) FROM flashcard), 1));
    SELECT setval(pg_get_serial_sequence('flashcard_deck', 'deck_id'), COALESCE((SELECT MAX(deck_id) FROM flashcard_deck), 1));
  `);
  console.log("Postgres Sequences updated successfully.");
  console.log("Geography Flashcards seeding into 5 Decks completed successfully!");
}

seedGeographyFlashcards()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


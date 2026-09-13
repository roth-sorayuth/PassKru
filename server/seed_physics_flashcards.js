import { prisma } from "./src/config/prisma.js";
import { PHYSICS_FLASHCARDS_DATA } from "./prisma/data/physicsFlashcardsData.js";

const DIFFICULTY_MAP = {
  "ងាយ": "easy",
  "មធ្យម": "medium",
  "ពិបាក": "hard",
  "easy": "easy",
  "medium": "medium",
  "hard": "hard",
};

const DECKS_CONFIG = [
  { deckId: 201, title: "ឈុតទី ១: មេកានិច & ថាមពល", description: "ល្បឿន សំទុះ ច្បាប់ញូតុន និងថាមពលមេកានិច" },
  { deckId: 202, title: "ឈុតទី ២: អគ្គិសនី & រលក", description: "ច្បាប់អូម រេស៊ីស្តង់ ខួប និងប្រេកង់រលក" },
  { deckId: 203, title: "ឈុតទី ៣: អុបទិក & ទែម៉ូឌីណាមិក", description: "ច្បាប់ចាំងពន្លឺ លិបិក្រម និងសីតុណ្ហភាពដាច់ខាត" },
  { deckId: 204, title: "ឈុតទី ៤: មេកានិចរាវ & ម៉ាញេទិច", description: "កម្លាំងអាក្យូម៉ែដ កម្លាំងឡូរ៉ង់្ស និងសមីការ E=mc²" },
  { deckId: 205, title: "ឈុតទី ៥: រូបវិទ្យាទំនើប & មេកានិច", description: "ការងារកម្លាំង សន្ទុះ ច្បាប់និចលភាព និងអានុភាព" },
  { deckId: 206, title: "ឈុតទី ៦: មេកានិចរាវ & ទែម៉ូឌីណាមិក", description: "សម្ពាធរាវ គោលការណ៍ប៉ាស្កាល់ និងច្បាប់ទែម៉ូឌីណាមិក" },
  { deckId: 207, title: "ឈុតទី ៧: អគ្គិសនី & ម៉ាញេទិច", description: "ច្បាប់គូឡុំ ដែនម៉ាញេទិច និងលំហូរម៉ាញេទិច" },
  { deckId: 208, title: "ឈុតទី ៨: រលក, អុបទិក & រូបវិទ្យាទំនើប", description: "កញ្ចក់ប៉ោង កញ្ចក់ផိန် ហ្វូតុង និងអ៊ីសូតូប" },
  { deckId: 209, title: "ឈុតទី ៩: រូបវិទ្យាអាតូម & ណ្វៃយ៉ូ", description: "បដិកម្មបំបែកណ្វៃយ៉ូ ប៉ោលសាមញ្ញ និងដង់ស៊ីតេ" },
  { deckId: 210, title: "ឈុតទី ១០: មេកានិច & ទែម៉ូឌីណាមិក", description: "សមីការស្ថានភាពឧស្ម័ន កុងដង់ស៊័រ និងចំណាំងផ្លាត" },
];

async function seedPhysicsFlashcards() {
  console.log("Seeding 10 Physics Decks and 100 Flashcards into Database...");

  // 1. Find or create Physics subject
  let physicsSubject = await prisma.subject.findFirst({
    where: { subjectName: "រូបវិទ្យា" },
  });

  if (!physicsSubject) {
    physicsSubject = await prisma.subject.create({
      data: {
        subjectName: "រូបវិទ្យា",
        description: "មុខវិជ្ជារូបវិទ្យា",
      },
    });
    console.log(`Created Physics subject with ID: ${physicsSubject.subjectId}`);
  } else {
    console.log(`Using Physics subject ID: ${physicsSubject.subjectId}`);
  }

  // 2. Create/upsert the 10 FlashcardDecks (201 to 210)
  for (const cfg of DECKS_CONFIG) {
    await prisma.flashcardDeck.upsert({
      where: { deckId: cfg.deckId },
      update: {
        subjectId: physicsSubject.subjectId,
        title: cfg.title,
        description: cfg.description,
      },
      create: {
        deckId: cfg.deckId,
        subjectId: physicsSubject.subjectId,
        title: cfg.title,
        description: cfg.description,
      },
    });
  }
  console.log("10 Physics Flashcard Decks (201-210) created/updated successfully.");

  // 3. Upsert/insert all 100 flashcards, dividing 10 cards per deck (deck 201 to 210)
  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < PHYSICS_FLASHCARDS_DATA.length; i++) {
    const cardData = PHYSICS_FLASHCARDS_DATA[i];
    const mappedDifficulty = DIFFICULTY_MAP[cardData.difficulty] || "medium";
    
    // Assign 10 cards to each deck (Cards 1-10 -> deck 201, Cards 11-20 -> deck 202, etc.)
    const deckId = 201 + Math.floor(i / 10);
    // Shift flashcard_id by 100 to avoid conflicts with Math cards (IDs 1-100)
    const flashcardId = 100 + cardData.flashcard_id;

    const existingCard = await prisma.flashcard.findUnique({
      where: { flashcardId },
    });

    if (existingCard) {
      await prisma.flashcard.update({
        where: { flashcardId },
        data: {
          deckId,
          subjectName: "រូបវិទ្យា",
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
          subjectName: "រូបវិទ្យា",
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

  console.log(`Successfully processed Physics flashcards: ${insertedCount} inserted, ${updatedCount} updated across 10 decks.`);

  // 4. Update Postgres sequences
  try {
    await prisma.$executeRawUnsafe(
      `SELECT setval('flashcard_flashcard_id_seq', (SELECT COALESCE(MAX(flashcard_id), 200) FROM flashcard));`
    );
    await prisma.$executeRawUnsafe(
      `SELECT setval('flashcard_deck_deck_id_seq', (SELECT COALESCE(MAX(deck_id), 210) FROM flashcard_deck));`
    );
    console.log("Postgres Sequences updated successfully.");
  } catch (err) {
    console.log("Sequence update note:", err.message);
  }
}

seedPhysicsFlashcards()
  .then(() => {
    console.log("Physics Flashcards seeding into 10 Decks completed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding Physics Flashcards:", err);
    process.exit(1);
  });


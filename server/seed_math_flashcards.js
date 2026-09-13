import { prisma } from "./src/config/prisma.js";
import { MATH_FLASHCARDS_DATA } from "./prisma/data/mathFlashcardsData.js";

const DIFFICULTY_MAP = {
  "ងាយ": "easy",
  "មធ្យម": "medium",
  "ពិបាក": "hard",
  "easy": "easy",
  "medium": "medium",
  "hard": "hard",
};

const DECKS_CONFIG = [
  { deckId: 101, title: "ឈុតទី ១: ពិជគណិត & ត្រីកោណមាត្រ", description: "រូបមន្តសមីការដឺក្រេទីពីរ ត្រីកោណមាត្រគ្រឹះ និងដេរីវេ" },
  { deckId: 102, title: "ឈុតទី ២: ពិជគណិត & ធរណីមាត្រ", description: "លោការីត អាំងតេក្រាល និងផ្ទៃក្រឡារង្វង់" },
  { deckId: 103, title: "ឈុតទី ៣: ស្វ៊ីស & ស្ថិតិ", description: "ស្វ៊ីសនព្ធន្ធ ស្វ៊ីសធរណីមាត្រ និងមធ្យមភាគ" },
  { deckId: 104, title: "ឈុតទី ៤: វេចទ័រ & ប្រូបាប៊ីលីតេ", description: "ផលគុណស្កាលែរ បម្លាស់ប្ដូរ និងបន្សំ" },
  { deckId: 105, title: "ឈុតទី ៥: ម៉ាទ្រីស & អនុគមន៍", description: "ដេធែមីណង់ ដេរីវេ និងអនុគមន៍គូ" },
  { deckId: 106, title: "ឈុតទី ៦: ត្រីកោណមាត្រ & ស្វ៊ីស", description: "រូបមន្តទ្វេមុំ ផលបូកស្វ៊ីស និងឫសការ៉េកុំផ្លិច" },
  { deckId: 107, title: "ឈុតទី ៧: កាល់គុល & ធរណីមាត្រ", description: "ដេរីវេប្រភាគ មាឌស្វែរ និងមាឌកោណ" },
  { deckId: 108, title: "ឈុតទី ៨: ពិជគណិត & ត្រីកោណមាត្រ", description: "ប្តូរគោលលោការីត អនុគមន៍សេស និងរូបមន្តបូកមុំ" },
  { deckId: 109, title: "ឈុតទី ៩: ធរណីមាត្រ & ស្ថិតិ", description: "មាឌស៊ីឡាំង ផលគុណឫស និងបម្រែបម្រួល" },
  { deckId: 110, title: "ឈុតទី ១០: កាល់គុល & ចំនួនកុំផ្លិច", description: "អាំងតេក្រាលដោយផ្នែក ទ្រឹស្តីបទដឺម៉ាវ្រ៍ និងលីមីត" },
];

async function seedMathFlashcards() {
  console.log("Seeding 10 Math Decks and 100 Flashcards into Database...");

  // 1. Find or create Math subject
  let mathSubject = await prisma.subject.findFirst({
    where: { subjectName: "គណិតវិទ្យា" },
  });

  if (!mathSubject) {
    mathSubject = await prisma.subject.create({
      data: {
        subjectName: "គណិតវិទ្យា",
        description: "មុខវិជ្ជាគណិតវិទ្យា",
      },
    });
    console.log(`Created Math subject with ID: ${mathSubject.subjectId}`);
  }

  // 2. Create/upsert the 10 FlashcardDecks (101 to 110)
  for (const cfg of DECKS_CONFIG) {
    await prisma.flashcardDeck.upsert({
      where: { deckId: cfg.deckId },
      update: {
        subjectId: mathSubject.subjectId,
        title: cfg.title,
        description: cfg.description,
      },
      create: {
        deckId: cfg.deckId,
        subjectId: mathSubject.subjectId,
        title: cfg.title,
        description: cfg.description,
      },
    });
  }
  console.log("10 Flashcard Decks (101-110) created/updated successfully.");

  // 3. Upsert/insert all 100 flashcards, dividing 10 cards per deck (deck 101 to 110)
  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < MATH_FLASHCARDS_DATA.length; i++) {
    const cardData = MATH_FLASHCARDS_DATA[i];
    const mappedDifficulty = DIFFICULTY_MAP[cardData.difficulty] || "medium";
    
    // Assign 10 cards to each deck (Cards 1-10 -> deck 101, Cards 11-20 -> deck 102, etc.)
    const deckId = 101 + Math.floor(i / 10);

    const existingCard = await prisma.flashcard.findUnique({
      where: { flashcardId: cardData.flashcard_id },
    });

    if (existingCard) {
      await prisma.flashcard.update({
        where: { flashcardId: cardData.flashcard_id },
        data: {
          deckId,
          subjectName: "គណិតវិទ្យា",
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
          flashcardId: cardData.flashcard_id,
          deckId,
          subjectName: "គណិតវិទ្យា",
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

  console.log(`Successfully processed flashcards: ${insertedCount} inserted, ${updatedCount} updated across 10 decks.`);

  // 4. Update Postgres sequences
  try {
    await prisma.$executeRawUnsafe(
      `SELECT setval('flashcard_flashcard_id_seq', (SELECT COALESCE(MAX(flashcard_id), 1) FROM flashcard));`
    );
    await prisma.$executeRawUnsafe(
      `SELECT setval('flashcard_deck_deck_id_seq', (SELECT COALESCE(MAX(deck_id), 110) FROM flashcard_deck));`
    );
    console.log("Postgres Sequences updated successfully.");
  } catch (err) {
    console.log("Sequence update note:", err.message);
  }
}

seedMathFlashcards()
  .then(() => {
    console.log("Math Flashcards seeding into 10 Decks completed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding Math Flashcards:", err);
    process.exit(1);
  });

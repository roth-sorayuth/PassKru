import { prisma } from "./src/config/prisma.js";
import { BIOLOGY_FLASHCARDS_DATA } from "./prisma/data/biologyFlashcardsData.js";

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
  { deckId: 801, title: "ឈុតទី ១: ជីវវិទ្យាកោសិកា & រស្មីសំយោគ", description: "មីតខុនដ្រី នុយក្លេអុស រស្មីសំយោគ មីតូស និងម៉េអុស" },
  { deckId: 802, title: "ឈុតទី ២: ហ្សែនវិទ្យា & សរីរវិទ្យាមនុស្ស", description: "DNA គ្លីកូលីស ប្រព័ន្ធឈាមរត់ ប្រព័ន្ធប្រសាទ និងអង់ស៊ីម" },
  { deckId: 803, title: "ឈុតទី ៣: សរីរវិទ្យារុក្ខជាតិ & អរម៉ូន", description: "ស៊ីឡែម ភ្លូអែម អេទីឡែន អាំងសុលីន និងអាក់សូន" },
  { deckId: 804, title: "ឈុតទី ៤: ជីវគីមី & ការបែងចែកកោសិកា", description: "លីសូសូម ចំណងប៉េបទីដ មេតាផាស និងប្រូផាសទី ១" },
  { deckId: 805, title: "ឈុតទី ៥: អតិសុខុមជីវសាស្ត្រ & ការវិវត្ត", description: "សរីរាង្គហូម៉ូឡូក និងអាណាឡូក វីរុស និងការបែងចែកបាក់តេរី" },
  { deckId: 806, title: "ឈុតទី ៦: សរីរវិទ្យាមនុស្ស & ស្វាយបូរ", description: "ពេស្ប៊ីន ថ្លើម នេហ្វ្រុង ADH ស្វាយបូរ និងចំហាយទឹក" },
  { deckId: 807, title: "ឈុតទី ៧: ជីវវិទ្យាកោសិកា & ហ្សែនវិទ្យា", description: "Active transport, ភីណូស៊ីតូស, Retroviruses, និង Lac operon" },
  { deckId: 808, title: "ឈុតទី ៨: រស្មីសំយោគ & វដ្ដក្រេប", description: "Cytoskeleton, Krebs cycle, ភ្នាសទីឡាកូអ៊ីដ, និង RuBisCO" },
  { deckId: 809, title: "ឈុតទី ៩: អភិវឌ្ឍន៍ & ប្រព័ន្ធភាពស៊ាំ", description: "DNA Ligase, tRNA, ADH, Cerebellum, ណឺត្រូហ្វិល, និង Helper T cells" },
  { deckId: 810, title: "ឈុតទី ១០: សរីរវិទ្យាមនុស្ស & ជីវវិទ្យាកោសិកា", description: "កាព្សីដ, វដ្ដលីទីក, ពោះវៀនតូច, X-linked disorders, និង Meiosis" },
];

async function seedBiologyFlashcards() {
  console.log("Seeding 10 Biology Decks and 100 Flashcards into Database...");

  // 1. Find or create Biology subject
  let biologySubject = await prisma.subject.findFirst({
    where: {
      OR: [
        { subjectName: "ជីវវិទ្យា" },
        { subjectName: "ជីវវិទ្យាខ្មែរ" }
      ]
    },
  });

  const subjectTitle = biologySubject ? biologySubject.subjectName : "ជីវវិទ្យា";

  if (!biologySubject) {
    biologySubject = await prisma.subject.create({
      data: {
        subjectName: subjectTitle,
        description: "មុខវិជ្ជាជីវវិទ្យា ជីវវិទ្យាកោសិកា និងសរីរវិទ្យា",
      },
    });
    console.log(`Created Biology subject with ID: ${biologySubject.subjectId}`);
  }

  // 2. Create/upsert the 10 FlashcardDecks (801 to 810)
  for (const cfg of DECKS_CONFIG) {
    await prisma.flashcardDeck.upsert({
      where: { deckId: cfg.deckId },
      update: {
        subjectId: biologySubject.subjectId,
        subjectName: subjectTitle,
        title: cfg.title,
        description: cfg.description,
      },
      create: {
        deckId: cfg.deckId,
        subjectId: biologySubject.subjectId,
        subjectName: subjectTitle,
        title: cfg.title,
        description: cfg.description,
      },
    });
  }
  console.log("10 Flashcard Decks (801-810) created/updated successfully.");

  // 3. Upsert/insert all 100 flashcards, dividing 10 cards per deck (deck 801 to 810)
  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < BIOLOGY_FLASHCARDS_DATA.length; i++) {
    const cardData = BIOLOGY_FLASHCARDS_DATA[i];
    const mappedDifficulty = DIFFICULTY_MAP[cardData.difficulty] || "medium";
    
    // Assign 10 cards to each deck (Cards 1-10 -> deck 801, Cards 11-20 -> deck 802, etc.)
    const deckId = 801 + Math.floor(i / 10);
    // Shift flashcard_id by 950 to avoid conflicts (Math: 1-100, Phys: 101-200, Chem: 201-299, GK: 301-500, Khmer: 501-700, History: 701-900, Geo: 901-950, Bio: 951-1050)
    const flashcardId = 950 + cardData.flashcard_id;

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

  console.log(`Successfully processed flashcards: ${insertedCount} inserted, ${updatedCount} updated across 10 decks.`);

  // Update Postgres Sequences so future auto-increments work smoothly
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('flashcard', 'flashcard_id'), COALESCE((SELECT MAX(flashcard_id) FROM flashcard), 1));
    SELECT setval(pg_get_serial_sequence('flashcard_deck', 'deck_id'), COALESCE((SELECT MAX(deck_id) FROM flashcard_deck), 1));
  `);
  console.log("Postgres Sequences updated successfully.");
  console.log("Biology Flashcards seeding into 10 Decks completed successfully!");
}

seedBiologyFlashcards()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


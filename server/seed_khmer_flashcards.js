import { prisma } from "./src/config/prisma.js";
import { KHMER_FLASHCARDS_DATA } from "./prisma/data/khmerFlashcardsData.js";

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
  { deckId: 501, title: "ឈុតទី ១: វេយ្យាករណ៍ខ្មែរ - មូលដ្ឋានគ្រឹះ", description: "ប្រភេទពាក្យ នាម កិរិយាសព្ទ គុណនាម និងទម្រង់ប្រយោគមូលដ្ឋាន" },
  { deckId: 502, title: "ឈុតទី ២: វេយ្យាករណ៍ខ្មែរ - កិរិយาวิសេសនៈ & ឈ្នាប់", description: "កិរិយาวิសេសនៈ អាយតនិបាត ឈ្នាប់ និងប្រយោគបដិសេធ" },
  { deckId: 503, title: "ឈុតទី ៣: អក្សរសាស្ត្រ - ព្យញ្ជនៈ & ស្រៈ", description: "ព្យញ្ជនៈ ៣៣ តួ ស្រៈពេញតួ ស្រៈនិស្ស័យ និងជើងព្យញ្ជនៈ" },
  { deckId: 504, title: "ឈុតទី ៤: អក្សរសាស្ត្រ - វណ្ណយុត្តិ & អក្ខរាវិរុទ្ធ", description: "ការប្រើប្រាស់សញ្ញាវណ្ណយុត្តិ ត្រីសព្ទ មូសិកទន្ត និងច្បាប់អក្ខរាវិរុទ្ធ" },
  { deckId: 505, title: "ឈុតទី ៥: អក្សរសិល្ប៍ - មូលដ្ឋាន & ឧបមា", description: "ប្រភេទអក្សរសិល្ប៍ ឧបមេយ្យ ឧបមាន និងកវីនិពន្ធ" },
  { deckId: 506, title: "ឈុតទី ៦: អក្សរសិល្ប៍បុរាណ - រឿងរាមកេរ្តិ៍ & ទុំទាវ", description: "រឿងរាមកេរ្តិ៍ខ្មែរ រឿងទុំទាវ និងស្នាដៃកវីសម័យលង្វែក" },
  { deckId: 507, title: "ឈុតទី ៧: អក្សរសិល្ប៍ទំនើប - ប្រលោមលោក", description: "រឿងកូឡាបប៉ៃលិន រឿងសុផាត រឿងផ្កាស្រពោន និងកវីទំនើប" },
  { deckId: 508, title: "ឈុតទី ៨: វចនានុក្រម - ពាក្យន័យដូច & ន័យផ្ទុយ", description: "ពាក្យន័យដូច ពាក្យន័យផ្ទុយ និងការវិភាគន័យពាក្យ" },
  { deckId: 509, title: "ឈុតទី ៩: វចនានុក្រម - ពាក្យកម្ចីបាលីសំស្ក្រឹត", description: "ឫសពាក្យ ពាក្យផ្សំ និងពាក្យកម្ចីពីបាលី-សំស្ក្រឹត" },
  { deckId: 510, title: "ឈុតទី ១០: រាជសព្ទ - ភាសាក្សត្រ", description: "ពាក្យរាជសព្ទប្រើប្រាស់សម្រាប់ព្រះមហាក្សត្រ និងរាជវង្ស" },
  { deckId: 511, title: "ឈុតទី ១១: សង្ឃសព្ទ & ភាសាសុជីវធម៌", description: "ពាក្យសង្ឃសព្ទ ភាសាសុជីវធម៌ និងការប្រើប្រាស់ក្នុងសង្គម" },
  { deckId: 512, title: "ឈុតទី ១២: សភាសិត & ច្បាប់បុរាណ", description: "សុភាសិតខ្មែរ ច្បាប់ស្រី ច្បាប់ប្រុស និងច្បាប់កេរកាល" },
  { deckId: 513, title: "ឈុតទី ១៣: សភាសិត & គតិបណ្ឌិត", description: "គតិបណ្ឌិតខ្មែរ អប់រំចិត្ត និងការទូន្មានប្រៀបប្រដៅ" },
  { deckId: 514, title: "ឈុតទី ១៤: តែងសេចក្តី - រចនាសម្ព័ន្ធ", description: "រចនាសម្ព័ន្ធតែងសេចក្តី ផ្តើមសេចក្តី តួសេចក្តី និងបញ្ចប់" },
  { deckId: 515, title: "ឈុតទី ១៥: តែងសេចក្តី - វិធីសាស្ត្រតែង", description: "វិធីសាស្ត្រតែងសេចក្តីពន្យល់ ពិភាក្សា និងប្រៀបធៀប" },
  { deckId: 516, title: "ឈុតទី ១៦: អក្សរសិល្ប៍ប្រជាប្រិយ - ព្រេងកថា", description: "រឿងព្រេងកថា រឿងវរវង្ស សូរវង្ស និងរឿងព្រេងប្រជាប្រិយខ្មែរ" },
  { deckId: 517, title: "ឈុតទី ១៧: អក្សរសិល្ប៍ប្រជាប្រិយ - គតិលោក", description: "រឿងធនញ្ជ័យ រឿងគតិលោក និងនិទានប្រៀបធៀប" },
  { deckId: 518, title: "ឈុតទី ១៨: ប្រវត្តិអក្សរសាស្ត្រ - សិលាចារឹក", description: "សិលាចារឹកខ្មែរបុរាណ ប្រវត្តិអក្សរខ្មែរ និងសម័យកាលអក្សរសាស្ត្រ" },
  { deckId: 519, title: "ឈុតទី ១៩: វចនានុក្រមជួនណាត & ស្តង់ដារ", description: "ស្នាដៃសម្ដេចសង្ឃរាជ ជួន ណាត និងស្តង់ដារអក្សរសាស្ត្រខ្មែរ" },
  { deckId: 520, title: "ឈុតទី ២០: ការប្រើប្រាស់ភាសា & សិល្បៈតែង", description: "ការប្រើប្រាស់ភាសាខ្មែរត្រឹមត្រូវ និងសិល្បៈនៃការតែងនិពន្ធ" },
];

async function seedKhmerFlashcards() {
  console.log("Seeding 20 Khmer Decks and 200 Flashcards into Database...");

  // 1. Find or create Khmer subject
  let khmerSubject = await prisma.subject.findFirst({
    where: { subjectName: "ភាសាខ្មែរ" },
  });

  if (!khmerSubject) {
    khmerSubject = await prisma.subject.create({
      data: {
        subjectName: "ភាសាខ្មែរ",
        description: "មុខវិជ្ជាភាសាខ្មែរ វេយ្យាករណ៍ និងអក្សរសាស្ត្រខ្មែរ",
      },
    });
    console.log(`Created Khmer subject with ID: ${khmerSubject.subjectId}`);
  }

  // 2. Create/upsert the 20 FlashcardDecks (501 to 520)
  for (const cfg of DECKS_CONFIG) {
    await prisma.flashcardDeck.upsert({
      where: { deckId: cfg.deckId },
      update: {
        subjectId: khmerSubject.subjectId,
        subjectName: "ភាសាខ្មែរ",
        title: cfg.title,
        description: cfg.description,
      },
      create: {
        deckId: cfg.deckId,
        subjectId: khmerSubject.subjectId,
        subjectName: "ភាសាខ្មែរ",
        title: cfg.title,
        description: cfg.description,
      },
    });
  }
  console.log("20 Flashcard Decks (501-520) created/updated successfully.");

  // 3. Upsert/insert all 200 flashcards, dividing 10 cards per deck (deck 501 to 520)
  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < KHMER_FLASHCARDS_DATA.length; i++) {
    const cardData = KHMER_FLASHCARDS_DATA[i];
    const mappedDifficulty = DIFFICULTY_MAP[cardData.difficulty] || "medium";
    
    // Assign 10 cards to each deck (Cards 1-10 -> deck 501, Cards 11-20 -> deck 502, etc.)
    const deckId = 501 + Math.floor(i / 10);
    // Shift flashcard_id by 500 to avoid conflicts (Math: 1-100, Physics: 101-200, Chem: 201-299, GK: 301-500, Khmer: 501-700)
    const flashcardId = 500 + cardData.flashcard_id;

    const existingCard = await prisma.flashcard.findUnique({
      where: { flashcardId },
    });

    if (existingCard) {
      await prisma.flashcard.update({
        where: { flashcardId },
        data: {
          deckId,
          subjectName: "ភាសាខ្មែរ",
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
          subjectName: "ភាសាខ្មែរ",
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

  console.log(`Successfully processed flashcards: ${insertedCount} inserted, ${updatedCount} updated across 20 decks.`);

  // Update Postgres Sequences so future auto-increments work smoothly
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('flashcard', 'flashcard_id'), COALESCE((SELECT MAX(flashcard_id) FROM flashcard), 1));
    SELECT setval(pg_get_serial_sequence('flashcard_deck', 'deck_id'), COALESCE((SELECT MAX(deck_id) FROM flashcard_deck), 1));
  `);
  console.log("Postgres Sequences updated successfully.");
  console.log("Khmer Flashcards seeding into 20 Decks completed successfully!");
}

seedKhmerFlashcards()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


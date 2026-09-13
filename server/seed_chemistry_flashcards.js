import { prisma } from "./src/config/prisma.js";
import { CHEMISTRY_FLASHCARDS_DATA } from "./prisma/data/chemistryFlashcardsData.js";

const DIFFICULTY_MAP = {
  "Easy": "easy",
  "Medium": "medium",
  "Hard": "hard",
  "ងាយ": "easy",
  "មធ្យម": "medium",
  "ពិបាក": "hard",
  "easy": "easy",
  "medium": "medium",
  "hard": "hard",
};

const DECKS_CONFIG = [
  { deckId: 301, title: "ឈុតទី ១: គីមីវិទ្យាទូទៅ & អាស៊ីត-បាស", description: "ចំនួនអូវកាដូ ទម្ងន់ម៉ូល ទ្រឹស្តីអាស៊ីត-បាស និងប្រតិកម្មរេដុកគ្រឹះ" },
  { deckId: 302, title: "ឈុតទី ២: គីមីសរីរាង្គ & ល្បឿនប្រតិកម្ម", description: "អ៊ីដ្រូកាបូនឆ្អែត-មិនឆ្អែត ក្រុមមុខងារ ល្បឿនប្រតិកម្ម និងទែម៉ូគីមី" },
  { deckId: 303, title: "ឈុតទី ៣: ទែម៉ូគីមី & លំនឹងគីមី", description: "ច្បាប់ហ្គុង គោលការណ៍ឡេសាតេលីយ៉េ ថេរលំនឹង Kc និងកោសិកាអគ្គិសនីគីមី" },
  { deckId: 304, title: "ឈុតទី ៤: អគ្គិសនីគីមី & គីមីសរីរាង្គ", description: "ប៉ូតាស្យែលកោសិកា ច្បាប់ម៉ាកូវនិកូវ សមីការអារេញ៉ុស និងសម្ពាធអូស្មូស" },
  { deckId: 305, title: "ឈុតទី ៥: រចនាសម្ព័ន្ធម៉ូលេគុល & ប្រតិកម្មសរីរាង្គ", description: "ទ្រឹស្តី VSEPR កូនហ្សេ ភាពអគ្គិសនីអវិជ្ជមាន ប្រតិកម្មអែស្ទែរកម្ម និងសាពូនីហ្វិកសកម្ម" },
  { deckId: 306, title: "ឈុតទី ៦: ជីវគីមី & គីមីនុយក្លេអ៊ែរ", description: "អាមីណូអាស៊ីត ចំណងប៉េបទីត ខួបបំបែកពាក់កណ្តាល ប៉ូលីមែរ និងថាមពលជីបស៍សេរី" },
  { deckId: 307, title: "ឈុតទី ៧: ច្បាប់ឧស្ម័ន & ទែម៉ូឌីណាមិក", description: "ច្បាប់ដាល់តុន ច្បាប់ក្រាហាំ ទ្រឹស្តីល្វីស Kp & Kc និងអង់ត្រូប៉ី" },
  { deckId: 308, title: "ឈុតទី ៨: អគ្គិសនីគីមី & ក្រុមមុខងារសរីរាង្គ", description: "សមីការណឺនស្ទ ច្បាប់ហ្វារ៉ាដេ អាល់ដេអ៊ីត-គីតូន និងការតេស្តតូឡិន" },
  { deckId: 309, title: "ឈុតទី ៩: កម្លាំងអន្តរម៉ូលេគុល & ដំណោះស្រាយ", description: "កម្លាំងវ៉ានឌ័រវ៉ាល់ ប្រតិកម្ម SN1/SN2 ម៉ូឡាលីត និងចំណុចរំពុះ-ទឹកកក" },
  { deckId: 310, title: "ឈុតទី ១០: អ៊ីសូតូប & ប្រតិកម្មនុយក្លេអ៊ែរ", description: "អ៊ីសូតូប-អ៊ីសូបារ ការបំបែកនុយក្លេអ៊ែរ កាបូនអសីតុណ្ហភាព និងប្រតិកម្មកាត់ផ្តាច់" },
];

async function seedChemistryFlashcards() {
  console.log("Seeding 10 Chemistry Decks and 99 Flashcards into Database...");

  // 1. Find or create Chemistry subject
  let chemSubject = await prisma.subject.findFirst({
    where: { subjectName: "គីមីវិទ្យា" },
  });

  if (!chemSubject) {
    chemSubject = await prisma.subject.create({
      data: {
        subjectName: "គីមីវិទ្យា",
        description: "មុខវិជ្ជាគីមីវិទ្យា",
      },
    });
    console.log(`Created Chemistry subject with ID: ${chemSubject.subjectId}`);
  }

  // 2. Create/upsert the 10 FlashcardDecks (301 to 310)
  for (const cfg of DECKS_CONFIG) {
    await prisma.flashcardDeck.upsert({
      where: { deckId: cfg.deckId },
      update: {
        subjectId: chemSubject.subjectId,
        subjectName: "គីមីវិទ្យា",
        title: cfg.title,
        description: cfg.description,
      },
      create: {
        deckId: cfg.deckId,
        subjectId: chemSubject.subjectId,
        subjectName: "គីមីវិទ្យា",
        title: cfg.title,
        description: cfg.description,
      },
    });
  }
  console.log("10 Flashcard Decks (301-310) created/updated successfully.");

  // 3. Upsert/insert all 99 flashcards, dividing 10 cards per deck (deck 301 to 310)
  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < CHEMISTRY_FLASHCARDS_DATA.length; i++) {
    const cardData = CHEMISTRY_FLASHCARDS_DATA[i];
    const mappedDifficulty = DIFFICULTY_MAP[cardData.difficulty] || "medium";
    
    // Assign 10 cards to each deck (Cards 1-10 -> deck 301, Cards 11-20 -> deck 302, etc.)
    const deckId = 301 + Math.floor(i / 10);
    // Shift flashcard_id by 200 to avoid conflicts (Math: 1-100, Physics: 101-200, Chemistry: 201-299)
    const flashcardId = 200 + cardData.flashcard_id;

    const existingCard = await prisma.flashcard.findUnique({
      where: { flashcardId },
    });

    if (existingCard) {
      await prisma.flashcard.update({
        where: { flashcardId },
        data: {
          deckId,
          subjectName: "គីមីវិទ្យា",
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
          subjectName: "គីមីវិទ្យា",
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
  console.log("Chemistry Flashcards seeding into 10 Decks completed successfully!");
}

seedChemistryFlashcards()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


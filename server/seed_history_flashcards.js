import { prisma } from "./src/config/prisma.js";
import { HISTORY_FLASHCARDS_DATA } from "./prisma/data/historyFlashcardsData.js";

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
  { deckId: 601, title: "វិញ្ញាសារទី ១: អាណាចក្រភ្នំ & ចេនឡា", description: "ដើមកំណើតអាណាចក្រភ្នំ ហ្វូណន និងសម័យចេនឡា" },
  { deckId: 602, title: "វិញ្ញាសារទី ២: ស្ថាបនាអាណាចក្រអង្គរ", description: "ព្រះបាទជ័យវរ្ម័នទី២ លទ្ធិទេវរាជ និងភ្នំគូលែន" },
  { deckId: 603, title: "វិញ្ញាសារទី ៣: អាណាចក្រអង្គរ & ទីក្រុងយសោធរបុរៈ", description: "ព្រះបាទយសោធរវរ្ម័នទី១ បារាយណ៍ និងស្ថាបត្យកម្មប្រាសាទបុរាណ" },
  { deckId: 604, title: "វិញ្ញាសារទី ៤: សម័យកោះកេរ & រាជេន្ទ្រវរ្ម័នទី២", description: "ប្រាសាទកោះកេរ បន្ទាយស្រី និងការផ្លាស់ប្តូររាជធានី" },
  { deckId: 605, title: "វិញ្ញាសារទី ៥: ព្រះបាទសូរ្យវរ្ម័នទី១ & ព្រះវិហារ", description: "ប្រាសាទព្រះវិហារ ភិមានអាកាស និងការបង្រួបបង្រួមអាណាចក្រ" },
  { deckId: 606, title: "វិញ្ញាសារទី ៦: ព្រះបាទសូរ្យវរ្ម័នទី២ & អង្គរវត្ត", description: "ការកសាងប្រាសាទអង្គរវត្ត និងសង្គ្រាមសម័យអង្គរ" },
  { deckId: 607, title: "វិញ្ញាសារទី ៧: ព្រះបាទជ័យវរ្ម័នទី៧ & ប្រាសាទបាយ័ន", description: "ការរំដោះក្រុងអង្គរ ប្រាសាទបាយ័ន មន្ទីរពេទ្យ និងសាលាសំណាក់" },
  { deckId: 608, title: "វិញ្ញាសារទី ៨: ចុងសម័យអង្គរ & កំណត់ហេតុជីវតាក្វាន់", description: "ទស្សនកិច្ចជីវ តាក្វាន់ ពុទ្ធសាសនាថេរវាទ និងការចុះថយនៃអង្គរ" },
  { deckId: 609, title: "វិញ្ញាសារទី ៩: ការប្តូររាជធានី & សម័យចតុម្មុខ", description: "ការបោះបង់ក្រុងអង្គរ ព្រះបាទពញាយ៉ាត និងវត្តភ្នំដូនពេញ" },
  { deckId: 610, title: "វិញ្ញាសារទី ១០: សម័យលង្វែក & ឧដុង្គ", description: "បន្ទាយលង្វែក ព្រះបាទអង្គច័ន្ទទី១ និងរាជធានីឧដុង្គ" },
  { deckId: 611, title: "វិញ្ញាសារទី ១១: សម័យអាណាព្យាបាលបារាំង", description: "សន្ធិសញ្ញាឆ្នាំ១៨៦៣ ព្រះបាទនរោត្តម និងការទាមទារខេត្តបាត់ដំបង-សៀមរាប" },
  { deckId: 612, title: "វិញ្ញាសារទី ១២: ព្រះរាជបូជនីយកិច្ច & ឯករាជ្យជាតិ", description: "ព្រះបាទនរោត្តម សីហនុ ឯករាជ្យជាតិ ៩ វិច្ឆិកា ១៩៥៣" },
  { deckId: 613, title: "វិញ្ញាសារទី ១៣: សម័យសង្គមរាស្ត្រនិយម & ស្ថាបត្យកម្ម", description: "ការអភិវឌ្ឍជាតិ ស្នាដៃស្ថាបត្យករ វណ្ណ មូលវណ្ណ និងវិមានឯករាជ្យ" },
  { deckId: 614, title: "វិញ្ញាសារទី ១៤: សាធារណរដ្ឋខ្មែរ & សង្គ្រាមស៊ីវិល", description: "រដ្ឋប្រហារឆ្នាំ១៩៧០ សេនាប្រមុខ លន់ នល់ និងសង្គ្រាមឥណ្ឌូចិន" },
  { deckId: 615, title: "វិញ្ញាសារទី ១៥: របបកម្ពុជាប្រជាធិបតេយ្យ (ខ្មែរក្រហម)", description: "ព្រឹត្តិការណ៍១៧មេសា១៩៧៥ របបអាវខ្មៅ និងការបាត់បង់ជីវិតប្រជាជន" },
  { deckId: 616, title: "វិញ្ញាសារទី ១៦: ជ័យជំនះ ៧ មករា & កិច្ចព្រមព្រៀងប៉ារីស", description: "ការរំដោះជាតិ ៧ មករា ១៩៧៩ និងកិច្ចព្រមព្រៀងសន្តិភាពប៉ារីស ២៣ តុលា ១៩៩១" },
  { deckId: 617, title: "វិញ្ញាសារទី ១៧: ស្ដាររាជាធិបតេយ្យ & ឈ្នះ-ឈ្នះ", description: "ការបោះឆ្នោត UNTAC ឆ្នាំ១៩៩៣ និងគោលនយោបាយឈ្នះ-ឈ្នះ ឆ្នាំ១៩៩៨" },
  { deckId: 618, title: "វិញ្ញាសារទី ១៨: បេតិកភណ្ឌពិភពលោក UNESCO", description: "អង្គរវត្ត ព្រះវិហារ សម្បូរព្រៃគុក របាំព្រះរាជទ្រព្យ និងល្បុក្កតោ" },
  { deckId: 619, title: "វិញ្ញាសារទី ១៩: សម័យទំនើប & ហេដ្ឋារចនាសម្ព័ន្ធ", description: "ការប្រកួត SEA Games 2023 ព្រែកជីកហ្វូណនតេជោ និងព្រលានយន្តហោះថ្មី" },
  { deckId: 620, title: "វិញ្ញាសារទី ២០: រដ្ឋធម្មនុញ្ញ & និមិត្តរូបជាតិ", description: "ទង់ជាតិកម្ពុជា អក្សរសាស្ត្រខ្មែរ និងរបបនយោបាយបច្ចុប្បន្ន" },
];

async function seedHistoryFlashcards() {
  console.log("Seeding 20 History Decks and 200 Flashcards into Database...");

  // 1. Find or create History subject
  let historySubject = await prisma.subject.findFirst({
    where: {
      OR: [
        { subjectName: "ប្រវត្តិវិទ្យា" },
        { subjectName: "ប្រវត្តិសាស្ត្រ" },
        { subjectName: "ប្រវត្តិសាស្ត្រខ្មែរ" }
      ]
    },
  });

  const subjectTitle = historySubject ? historySubject.subjectName : "ប្រវត្តិវិទ្យា";

  if (!historySubject) {
    historySubject = await prisma.subject.create({
      data: {
        subjectName: subjectTitle,
        description: "មុខវិជ្ជាប្រវត្តិវិទ្យា និងប្រវត្តិសាស្ត្រខ្មែរ",
      },
    });
    console.log(`Created History subject with ID: ${historySubject.subjectId}`);
  }

  // 2. Create/upsert the 20 FlashcardDecks (601 to 620)
  for (const cfg of DECKS_CONFIG) {
    await prisma.flashcardDeck.upsert({
      where: { deckId: cfg.deckId },
      update: {
        subjectId: historySubject.subjectId,
        subjectName: subjectTitle,
        title: cfg.title,
        description: cfg.description,
      },
      create: {
        deckId: cfg.deckId,
        subjectId: historySubject.subjectId,
        subjectName: subjectTitle,
        title: cfg.title,
        description: cfg.description,
      },
    });
  }
  console.log("20 Flashcard Decks (601-620) created/updated successfully.");

  // 3. Upsert/insert all 200 flashcards, dividing 10 cards per deck (deck 601 to 620)
  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < HISTORY_FLASHCARDS_DATA.length; i++) {
    const cardData = HISTORY_FLASHCARDS_DATA[i];
    const mappedDifficulty = DIFFICULTY_MAP[cardData.difficulty] || "medium";
    
    // Assign 10 cards to each deck (Cards 1-10 -> deck 601, Cards 11-20 -> deck 602, etc.)
    const deckId = 601 + Math.floor(i / 10);
    // Shift flashcard_id by 700 to avoid conflicts (Math: 1-100, Phys: 101-200, Chem: 201-299, GK: 301-500, Khmer: 501-700, History: 701-900)
    const flashcardId = 700 + cardData.flashcard_id;

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

  console.log(`Successfully processed flashcards: ${insertedCount} inserted, ${updatedCount} updated across 20 decks.`);

  // Update Postgres Sequences so future auto-increments work smoothly
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('flashcard', 'flashcard_id'), COALESCE((SELECT MAX(flashcard_id) FROM flashcard), 1));
    SELECT setval(pg_get_serial_sequence('flashcard_deck', 'deck_id'), COALESCE((SELECT MAX(deck_id) FROM flashcard_deck), 1));
  `);
  console.log("Postgres Sequences updated successfully.");
  console.log("History Flashcards seeding into 20 Decks completed successfully!");
}

seedHistoryFlashcards()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


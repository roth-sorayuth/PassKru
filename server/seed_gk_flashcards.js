import { prisma } from "./src/config/prisma.js";
import { GENERAL_KNOWLEDGE_FLASHCARDS_DATA } from "./prisma/data/generalKnowledgeFlashcardsData.js";

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
  { deckId: 401, title: "វិញ្ញាសារទី ១: ប្រវត្តិសាស្ត្រ & ភូមិសាស្ត្រខ្មែរ", description: "ប្រាសាទអង្គរវត្ត ទន្លេសាប របាំព្រះរាជទ្រព្យ អាណាចក្រភ្នំ និងឯករាជ្យជាតិ" },
  { deckId: 402, title: "វិញ្ញាសារទី ២: សេដ្ឋកិច្ច & បេតិកភណ្ឌ", description: "សត្វទုံး សិល្បៈប្រជាប្រិយ ទន្លេមេគង្គ ប្រាសាទបន្ទាយស្រី និង UNESCO" },
  { deckId: 403, title: "វិញ្ញាសារទី ៣: អាណាចក្រអង្គរ & សិល្បៈ", description: "ព្រះបាទជ័យវរ្ម័នទី២ ប្រាសាទតាព្រហ្ម ល្ខោនខោល និងចម្លាក់កូរសមុទ្រទឹកដោះ" },
  { deckId: 404, title: "វិញ្ញាសារទី ៤: រដ្ឋធម្មនុញ្ញ & ភូមិសាស្ត្រ", description: "រដ្ឋធម្មនុញ្ញឆ្នាំ១៩៤៧ ក្បាច់នាយកំរោង ស្ថាបត្យកម្មប្រាសាទបាគង និងប្រាក់រៀល" },
  { deckId: 405, title: "វិញ្ញាសារទី ៥: អក្សរសាស្ត្រ & សន្ធិសញ្ញា", description: "របាំត្រុដិ ដីក្រហមកសិកម្ម ដើមកំណើតកម្ពុជា អក្សរខ្មែរបុរាណ និងសន្ធិសញ្ញា១៨៦៣" },
  { deckId: 406, title: "វិញ្ញាសារទី ៦: ស្ថាបត្យកម្ម & ប្រពៃណី", description: "ល្ខោនស្បែកធំ ឧទ្យានជាតិបូកគោ កិច្ចព្រមព្រៀងសន្តិភាពប៉ារីស និងប្រាសាទបន្ទាយឆ្មារ" },
  { deckId: 407, title: "វិញ្ញាសារទី ៧: សម័យចេនឡា & រដ្ឋបាល", description: "ប្រាសាទសំបូរព្រៃគុក ពិធីបុណ្យអុំទូក ប្រាសាទព្រះវិហារ និងសិល្បៈចម្លាក់" },
  { deckId: 408, title: "វិញ្ញាសារទី ៨: ពិធីបុណ្យ & ស្ថាបត្យករ", description: "ពិធីកោរជុក បារាយណ៍ទឹកថ្លា ស្ថាបត្យករ វ៉ាន់ ម៉ូលីវណ្ណ និងរ៉ែត្បូងប៉ៃលិន" },
  { deckId: 409, title: "វិញ្ញាសារទី ៩: ប្រវត្តិសាស្ត្រ & វចនានុក្រម", description: "ច្បាប់ស្រី-ច្បាប់ប្រុស ប្រាសាទតាកែវ ព្រះរាជបូជនីយកិច្ច និងវចនានុក្រមជួនណាត" },
  { deckId: 410, title: "វិញ្ញាសារទី ១០: បេតិកភណ្ឌ UNESCO & វប្បធម៌", description: "ប្រាសាទបាភួន បឹងយក្សឡោម ទីក្រុងភ្នំពេញ និងរមណីយដ្ឋានប្រាសាទកោះកេរ" },
  { deckId: 411, title: "វិញ្ញាសារទី ១១: ឌីជីថល & គម្រោងជាតិ", description: "ប្រព័ន្ធទូទាត់បាគង ផ្លូវល្បឿនលឿន ព្រលានយន្តហោះតេជោ ស៊ីហ្គេម២០២៣ និងព្រែកជីកហ្វូណន" },
  { deckId: 412, title: "វិញ្ញាសារទី ១២: អប់រំ & សេដ្ឋកិច្ចជាតិ", description: "ការកែទម្រង់អប់រំ ប័ណ្ណសមធម៌ សសរស្តម្ភសេដ្ឋកិច្ចជាតិ និងអព្យាក្រឹត្យកាបូន២០៥០" },
  { deckId: 413, title: "វិញ្ញាសារទី ១៣: សុខាភិបាល & យុវជន", description: " FinTech គាំពារសង្គម ប.ស.ស. ទេសចរណ៍ជាតិ និង Verify.GOV.KH" },
  { deckId: 414, title: "វិញ្ញាសារទី ១៤: វិនិយោគ & គាំពារសង្គម", description: " គុនខ្មែរ គុនល្បុក្កតោ កសិកម្មទំនើប ច្បាប់វិនិយោគថ្មី និងកូឡាបប៉ៃលិន" },
  { deckId: 415, title: "វិញ្ញាសារទី ១៥: កសិកម្ម & ពាណិជ្ជកម្ម RCEP", description: "ស្ពានអាកាស-ផ្លូវក្រោមដី សាលារៀនជំនាន់ថ្មី ពាណិជ្ជកម្ម RCEP និងច្រកចេញចូលតែមួយ" },
  { deckId: 416, title: "វិញ្ញាសារទី ១៦: KHQR & បរិស្ថានចីរភាព", description: "យុទ្ធនាការកាត់បន្ថយប្លាស្ទិក Techo Startup Center ស្តង់ដារ KHQR និងព្រលានយន្តហោះសៀមរាប" },
  { deckId: 417, title: "វិញ្ញាសារទី ១៧: ជំនាញ ICT & អភិបាលកិច្ច", description: "ការគ្របដណ្តប់សុខភាពជាសាកល CamDX មន្ត្រីកសិកម្មឃុំ-សង្កាត់ និងជំនាញ ICT" },
  { deckId: 418, title: "វិញ្ញាសារទី ១៨: របាំបុរាណ & ផ្លូវដែក", description: "ទំនប់វារីអគ្គិសនី ក្រុមប្រឹក្សាអភិវឌ្ឍន៍កម្ពុជា កាបូបលុយឌីជីថល និងផ្លូវដែកល្បឿនលឿន" },
  { deckId: 419, title: "វិញ្ញាសារទី ១៩: សេដ្ឋកិច្ចឌីជីថល & បាក់ឌុប", description: "ចក្ខុវិស័យសេដ្ឋកិច្ចឌីជីថល២០៣៥ ការប្រឡងបាក់ឌុប ប្រព័ន្ធចុះបញ្ជី Single Portal និងកងកម្លាំងមួកខៀវ" },
  { deckId: 420, title: "វិញ្ញាសារទី ២០: ទីក្រុងច្នៃប្រឌិត & ចក្ខុវិស័យ", description: " ទីក្រុងច្នៃប្រឌិត UNESCO ថាមពលស្អាត ចក្ខុវិស័យកម្ពុជា២០៥០ និងយុទ្ធសាស្ត្របញ្ចកោណ" },
];

async function seedGeneralKnowledgeFlashcards() {
  console.log("Seeding 20 General Knowledge Decks and 200 Flashcards into Database...");

  // 1. Find or create General Knowledge subject
  let gkSubject = await prisma.subject.findFirst({
    where: { subjectName: "វប្បធម៌ទូទៅ" },
  });

  if (!gkSubject) {
    gkSubject = await prisma.subject.create({
      data: {
        subjectName: "វប្បធម៌ទូទៅ",
        description: "មុខវិជ្ជាវប្បធម៌ទូទៅ និងចំណេះដឹងទូទៅ",
      },
    });
    console.log(`Created General Knowledge subject with ID: ${gkSubject.subjectId}`);
  }

  // 2. Create/upsert the 20 FlashcardDecks (401 to 420)
  for (const cfg of DECKS_CONFIG) {
    await prisma.flashcardDeck.upsert({
      where: { deckId: cfg.deckId },
      update: {
        subjectId: gkSubject.subjectId,
        subjectName: "វប្បធម៌ទូទៅ",
        title: cfg.title,
        description: cfg.description,
      },
      create: {
        deckId: cfg.deckId,
        subjectId: gkSubject.subjectId,
        subjectName: "វប្បធម៌ទូទៅ",
        title: cfg.title,
        description: cfg.description,
      },
    });
  }
  console.log("20 Flashcard Decks (401-420) created/updated successfully.");

  // 3. Upsert/insert all 200 flashcards, dividing 10 cards per deck (deck 401 to 420)
  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < GENERAL_KNOWLEDGE_FLASHCARDS_DATA.length; i++) {
    const cardData = GENERAL_KNOWLEDGE_FLASHCARDS_DATA[i];
    const mappedDifficulty = DIFFICULTY_MAP[cardData.difficulty] || "medium";
    
    // Assign 10 cards to each deck (Cards 1-10 -> deck 401, Cards 11-20 -> deck 402, etc.)
    const deckId = 401 + Math.floor(i / 10);
    // Shift flashcard_id by 300 to avoid conflicts (Math: 1-100, Physics: 101-200, Chemistry: 201-299, GK: 301-500)
    const flashcardId = 300 + cardData.flashcard_id;

    const existingCard = await prisma.flashcard.findUnique({
      where: { flashcardId },
    });

    if (existingCard) {
      await prisma.flashcard.update({
        where: { flashcardId },
        data: {
          deckId,
          subjectName: "វប្បធម៌ទូទៅ",
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
          subjectName: "វប្បធម៌ទូទៅ",
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
  console.log("General Knowledge Flashcards seeding into 20 Decks completed successfully!");
}

seedGeneralKnowledgeFlashcards()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


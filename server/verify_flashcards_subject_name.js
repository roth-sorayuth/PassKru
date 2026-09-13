import { prisma } from "./src/config/prisma.js";

async function main() {
  const cardsWithoutSubject = await prisma.flashcard.count({
    where: {
      OR: [
        { subjectName: null },
        { subjectName: "" }
      ]
    }
  });

  const mathCardsCount = await prisma.flashcard.count({
    where: { subjectName: "គណិតវិទ្យា" }
  });

  const physicsCardsCount = await prisma.flashcard.count({
    where: { subjectName: "រូបវិទ្យា" }
  });

  const chemistryCardsCount = await prisma.flashcard.count({
    where: { subjectName: "គីមីវិទ្យា" }
  });

  const gkCardsCount = await prisma.flashcard.count({
    where: { subjectName: "វប្បធម៌ទូទៅ" }
  });

  const khmerCardsCount = await prisma.flashcard.count({
    where: { subjectName: "ភាសាខ្មែរ" }
  });

  const historyCardsCount = await prisma.flashcard.count({
    where: {
      OR: [
        { subjectName: "ប្រវត្តិវិទ្យា" },
        { subjectName: "ប្រវត្តិសាស្ត្រ" },
        { subjectName: "ប្រវត្តិសាស្ត្រខ្មែរ" }
      ]
    }
  });

  const geographyCardsCount = await prisma.flashcard.count({
    where: {
      OR: [
        { subjectName: "ភូមិវិទ្យា" },
        { subjectName: "ភូមិសាស្ត្រ" }
      ]
    }
  });

  const biologyCardsCount = await prisma.flashcard.count({
    where: {
      OR: [
        { subjectName: "ជីវវិទ្យា" },
        { subjectName: "ជីវវិទ្យាខ្មែរ" }
      ]
    }
  });

  const totalCards = await prisma.flashcard.count();
  const totalDecks = await prisma.flashcardDeck.count();

  console.log(`Total decks: ${totalDecks}`);
  console.log(`Total flashcards: ${totalCards}`);
  console.log(`Math flashcards (subject_name = 'គណិតវិទ្យា'): ${mathCardsCount}`);
  console.log(`Physics flashcards (subject_name = 'រូបវិទ្យា'): ${physicsCardsCount}`);
  console.log(`Chemistry flashcards (subject_name = 'គីមីវិទ្យា'): ${chemistryCardsCount}`);
  console.log(`General Knowledge flashcards (subject_name = 'វប្បធម៌ទូទៅ'): ${gkCardsCount}`);
  console.log(`Khmer flashcards (subject_name = 'ភាសាខ្មែរ'): ${khmerCardsCount}`);
  console.log(`History flashcards (subject_name = 'ប្រវត្តិវិទ្យា/ប្រវត្តិសាស្ត្រ'): ${historyCardsCount}`);
  console.log(`Geography flashcards (subject_name = 'ភូមិវិទ្យា'): ${geographyCardsCount}`);
  console.log(`Biology flashcards (subject_name = 'ជីវវិទ្យា'): ${biologyCardsCount}`);
  console.log(`Flashcards missing subject_name: ${cardsWithoutSubject}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

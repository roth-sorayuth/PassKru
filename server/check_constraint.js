import { prisma } from "./src/config/prisma.js";

async function main() {
  const res = await prisma.$queryRawUnsafe(
    "SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'flashcard'::regclass;"
  );
  console.log(res);
}

main().finally(() => prisma.$disconnect());


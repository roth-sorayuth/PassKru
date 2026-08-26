// import "dotenv/config";
// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//     seed: "node prisma/seed.js",
//   },
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL (port 5432, no pgbouncer) for db push / migrate
    url: env("DIRECT_URL"),
  },
});
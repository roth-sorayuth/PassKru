import "dotenv/config";
import app from "./app.js";



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  const mode = process.env.NODE_ENV || "development";
  console.log(`\n🚀 PassKru Server running in ${mode} mode`);
  console.log(`📡 Local:    http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🩺 Health:   http://localhost:${PORT}/health\n`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

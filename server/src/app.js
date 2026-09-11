import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index.js";
import { openApiSpec } from "./docs/openapi.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OpenAPI Spec & Swagger UI Documentation
app.get("/openapi.json", (req, res) => {
  res.json(openApiSpec);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customSiteTitle: "PassKru API Documentation",
    customCss: ".swagger-ui .topbar { display: block; }",
  })
);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// API Routes
app.use("/api", router);

// Catch-all route
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error handler caught error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;

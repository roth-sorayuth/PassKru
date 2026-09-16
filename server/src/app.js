import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index.js";
import { openApiSpec } from "./docs/openapi.js";

const app = express();

// Middleware
// CORS_ORIGINS is a comma-separated allowlist, e.g.
// "https://passkru.com,https://admin.passkru.com,http://localhost:3000,http://localhost:3001".
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/[\r\n]+/g, "").replace(/\/+$/, ""))
  .filter(Boolean);
if (allowedOrigins.length) {
  app.use(cors({ origin: allowedOrigins, credentials: true }));
} else {
  console.warn("CORS_ORIGINS is not set: the API accepts requests from any origin.");
  app.use(cors());
}
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
  // Unexpected (5xx) errors can carry database or code details; don't send those to clients in production.
  const hideDetails = statusCode >= 500 && process.env.NODE_ENV === "production";
  const message = hideDetails ? "Internal Server Error" : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;

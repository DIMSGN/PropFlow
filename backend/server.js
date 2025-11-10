/**
 * PropFlow Backend Server
 *
 * Κεντρικό αρχείο του backend server (Main backend server file)
 * Διαχειρίζεται τη σύνδεση με τη βάση, middleware, και API routes.
 * Manages database connection, middleware setup, and API routes.
 *
 * @module server
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Import routes (Εισαγωγή routes)
const appointmentRoutes = require("./routes/appointmentRoutes");
const clientRoutes = require("./routes/clientRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const userRoutes = require("./routes/userRoutes");

// Import database connection (Εισαγωγή σύνδεσης βάσης)
const { sequelize } = require("./models");

// Δημιουργία Express εφαρμογής (Create Express application)
const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Έλεγχος ύπαρξης φακέλου uploads (Ensure uploads directory exists)
 * Δημιουργείται αυτόματα αν δεν υπάρχει.
 * Created automatically if it doesn't exist.
 */
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory");
}

/**
 * Middleware Configuration (Ρύθμιση Middleware)
 */

// HTTP request logging - μόνο σε development (only in development)
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS ρύθμιση με whitelist (CORS setup with whitelist)
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
  // Allow all Vercel preview deployments during development
  ...(process.env.ALLOW_VERCEL_PREVIEWS === "true" ? [] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Επιτρέπει requests χωρίς origin (π.χ. mobile apps, Postman)
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments (*.vercel.app)
      if (process.env.ALLOW_VERCEL_PREVIEWS === "true" && origin) {
        if (
          origin.endsWith(".vercel.app") ||
          origin.endsWith("localhost:3000")
        ) {
          return callback(null, true);
        }
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// JSON parsing με όριο μεγέθους (JSON parsing with size limit)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Στατικά αρχεία για uploads (Static files for uploads)
app.use("/uploads", express.static(uploadsDir));

/**
 * Σύνδεση με τη Βάση Δεδομένων (Database Connection)
 */
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");
    console.log(`   Database: ${sequelize.config.database}`);
    console.log(`   Host: ${sequelize.config.host}`);
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:");
    console.error(err.message);
    // Δεν κάνουμε exit, ώστε η εφαρμογή να μπορεί να ξεκινήσει
    // Don't exit, so the app can start (health check will show DB issues)
  });

/**
 * Database Synchronization (Συγχρονισμός Βάσης)
 *
 * ΠΡΟΣΟΧΗ: Χρησιμοποιείται ΜΟΝΟ σε development!
 * WARNING: Use ONLY in development!
 * Για παραγωγή, χρησιμοποιήστε migrations.
 * For production, use migrations.
 */
if (process.env.SYNC_DB === "true" && NODE_ENV === "development") {
  sequelize
    .sync({ alter: false }) // alter: false για ασφάλεια (for safety)
    .then(() => {
      console.log("✅ Database synced successfully");
    })
    .catch((err) => {
      console.error("❌ Unable to sync the database:");
      console.error(err.message);
    });
} else if (process.env.SYNC_DB === "true" && NODE_ENV === "production") {
  console.warn(
    "⚠️  WARNING: SYNC_DB is enabled in production! This is dangerous!"
  );
  console.warn("   Use database migrations instead of sync in production.");
}

/**
 * API Routes (Διαδρομές API)
 */
app.use("/api/appointments", appointmentRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);

/**
 * Health Check Endpoint
 * Χρησιμοποιείται για monitoring και load balancers
 * Used for monitoring and load balancers
 */
app.get("/health", async (req, res) => {
  try {
    // Έλεγχος σύνδεσης βάσης (Check database connection)
    await sequelize.authenticate();

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Database connection failed",
      environment: NODE_ENV,
    });
  }
});

/**
 * Root Endpoint
 */
app.get("/", (req, res) => {
  res.json({
    name: "PropFlow API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      appointments: "/api/appointments",
      clients: "/api/clients",
      properties: "/api/properties",
      users: "/api/users",
      health: "/health",
    },
  });
});

/**
 * 404 Handler - Χειρισμός μη υπαρχόντων routes (Handle non-existent routes)
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      "/api/appointments",
      "/api/clients",
      "/api/properties",
      "/api/users",
    ],
  });
});

/**
 * Global Error Handler - Κεντρικός χειρισμός σφαλμάτων (Centralized error handling)
 */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  // CORS errors
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: err.message,
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
      details: err.errors,
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    error: err.name || "Internal Server Error",
    message:
      NODE_ENV === "production" ? "An unexpected error occurred" : err.message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
/**
 * Εκκίνηση Server (Start Server)
 * Bind to 0.0.0.0 for Render compatibility
 */
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("\n🚀 PropFlow Server Started");
  console.log(`   Environment: ${NODE_ENV}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/health\n`);
});onsole.log(`   Port: ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/health\n`);
});

/**
 * Graceful Shutdown (Κλείσιμο με ασφάλεια)
 * Κλείνει τις συνδέσεις σωστά όταν σταματά η εφαρμογή.
 * Properly closes connections when application stops.
 */
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Σταματάμε να δεχόμαστε νέα requests (Stop accepting new requests)
  server.close(async () => {
    console.log("✅ HTTP server closed");

    try {
      // Κλείνουμε τη σύνδεση με τη βάση (Close database connections)
      await sequelize.close();
      console.log("✅ Database connections closed");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Αναγκαστικό κλείσιμο μετά από 10 δευτερόλεπτα (Force shutdown after 10 seconds)
  setTimeout(() => {
    console.error("❌ Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

// Χειρισμός shutdown signals (Handle shutdown signals)
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = app;

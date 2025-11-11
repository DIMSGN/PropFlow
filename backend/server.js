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

/**
 * ============================================================================
 * ΣΗΜΕΙΟ ΣΥΝΔΕΣΗΣ #1: CORS - Επιτρέπει το Frontend να μιλήσει με το Backend
 * CONNECTION POINT #1: CORS - Allows Frontend to communicate with Backend
 * ============================================================================
 * 
 * ❓ ΤΙ ΕΙΝΑΙ: Ασφαλιστική πόρτα που ελέγχει ποιος μπορεί να στείλει requests
 * ❓ WHAT IS: Security gate that controls who can send requests
 * 
 * 📍 ΓΙΑΤΙ ΧΡΕΙΑΖΕΤΑΙ: Οι browsers δεν επιτρέπουν σε μια ιστοσελίδα (π.χ. vercel.app)
 *    να στέλνει requests σε άλλο domain (π.χ. render.com) χωρίς άδεια!
 * 📍 WHY NEEDED: Browsers block websites from different domains talking to each other
 *    without permission (security feature called "Same Origin Policy")
 * 
 * 🔧 ΠΩΣ ΔΟΥΛΕΥΕΙ:
 *    1. Frontend (https://propflow.vercel.app) στέλνει request
 *    2. Browser λέει: "Περίμενε! Αυτό είναι .vercel.app αλλά το API είναι .render.com!"
 *    3. Backend (εδώ) λέει: "Είναι OK, το επιτρέπω!" (via CORS headers)
 *    4. Browser: "Εντάξει, θα το αφήσω να περάσει"
 * 
 * @constant {Array<string>} allowedOrigins - Λίστα επιτρεπόμενων frontend URLs
 * @property {string} process.env.FRONTEND_URL - Το production frontend URL (από Vercel)
 * @property {string} "http://localhost:3000" - Για local development
 */
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
  // Allow all Vercel preview deployments during development
  ...(process.env.ALLOW_VERCEL_PREVIEWS === "true" ? [] : []),
];

app.use(
  cors({
    /**
     * @param {string} origin - Η διεύθυνση από όπου ήρθε το request (πχ. https://propflow.vercel.app)
     * @param {Function} callback - Λέει στον browser αν επιτρέπεται ή όχι
     */
    origin: (origin, callback) => {
      // Επιτρέπει requests χωρίς origin (π.χ. mobile apps, Postman)
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Ελέγχει αν το origin είναι στη λίστα των επιτρεπόμενων
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Επιτρέπει Vercel preview deployments (*.vercel.app)
      // Allow Vercel preview deployments (*.vercel.app)
      if (process.env.ALLOW_VERCEL_PREVIEWS === "true" && origin) {
        if (
          origin.endsWith(".vercel.app") ||
          origin.endsWith("localhost:3000")
        ) {
          return callback(null, true);
        }
      }

      // ΑΠΟΚΛΕΙΣΜΟΣ: Αν φτάσαμε εδώ, το origin ΔΕΝ επιτρέπεται
      // BLOCKED: If we reach here, the origin is NOT allowed
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true, // Επιτρέπει cookies/authentication headers
  })
);

/**
 * ============================================================================
 * ΣΗΜΕΙΟ ΣΥΝΔΕΣΗΣ #2: JSON Parser - Μεταφράζει τα μηνύματα από το Frontend
 * CONNECTION POINT #2: JSON Parser - Translates messages from Frontend
 * ============================================================================
 * 
 * 📦 ΤΙ ΚΑΝΕΙ: Όταν το frontend στέλνει δεδομένα (πχ. νέος client), τα στέλνει
 *    σαν "κείμενο" (JSON string). Αυτό το middleware τα μετατρέπει σε JavaScript object
 * 📦 WHAT IT DOES: When frontend sends data (e.g., new client), it sends it as
 *    "text" (JSON string). This middleware converts it to JavaScript object
 * 
 * 📨 ΠΑΡΑΔΕΙΓΜΑ:
 *    Frontend στέλνει: '{"first_name":"Δημήτρης","email":"test@example.com"}'
 *    Middleware μετατρέπει σε: { first_name: "Δημήτρης", email: "test@example.com" }
 *    Controller παίρνει: req.body = { first_name: "Δημήτρης", ... }
 * 
 * @middleware express.json - Διαβάζει JSON από το request body
 * @middleware express.urlencoded - Διαβάζει form data από το request body
 * @param {string} limit - Μέγιστο μέγεθος request (10MB για file uploads)
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Στατικά αρχεία για uploads (Static files for uploads)
app.use("/uploads", express.static(uploadsDir));

/**
 * ============================================================================
 * ΣΗΜΕΙΟ ΣΥΝΔΕΣΗΣ #3: API Routes - Οι "Πόρτες" που Ακούει το Backend
 * CONNECTION POINT #3: API Routes - The "Doors" the Backend Listens To
 * ============================================================================
 * 
 * 🚪 ΤΙ ΕΙΝΑΙ: Ορίζουμε ποιες διευθύνσεις (URLs) θα δέχεται το backend
 * 🚪 WHAT IS: We define which addresses (URLs) the backend will accept
 * 
 * 📍 ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ:
 *    Όταν το frontend στέλνει: GET https://propflow-8k3o.onrender.com/api/clients
 *    1. Backend βλέπει "/api/clients"
 *    2. Ψάχνει ποιο route αντιστοιχεί
 *    3. Βρίσκει: app.use("/api/clients", clientRoutes)
 *    4. Στέλνει το request στο clientRoutes.js
 *    5. Το clientRoutes.js το στέλνει στον controller
 * 
 * @route /api/appointments - Διαχείριση ραντεβού (appointments management)
 * @route /api/clients - Διαχείριση πελατών (clients management)
 * @route /api/properties - Διαχείριση ακινήτων (properties management)
 * @route /api/users - Διαχείριση χρηστών & authentication (users & auth)
 * 
 * ⚠️ ΣΗΜΑΝΤΙΚΟ: Αυτές οι γραμμές ΔΕΝ κάνουν τη δουλειά μόνες τους!
 *    Απλά λένε "Όταν δεις /api/clients, πήγαινε στο clientRoutes.js"
 *    Το clientRoutes.js έχει τις πραγματικές λειτουργίες (GET, POST, PUT, DELETE)
 */

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
 * ============================================================================
 * ΣΗΜΕΙΟ ΣΥΝΔΕΣΗΣ #3: API Routes Registration - Καταχώρηση των "Πορτών"
 * CONNECTION POINT #3: API Routes Registration - Registering the "Doors"
 * ============================================================================
 * 
 * 🎯 ΤΙ ΚΑΝΕΙ: Συνδέει κάθε URL path με το αντίστοιχο routes file
 * 🎯 WHAT IT DOES: Links each URL path to its corresponding routes file
 * 
 * 📍 FLOW ΠΑΡΑΔΕΙΓΜΑ (Frontend → Backend):
 * 
 *    Frontend κάνει: axios.get("https://propflow-8k3o.onrender.com/api/clients")
 *                                                                      ↓
 *    1. Request φτάνει στο backend server                              ↓
 *    2. Express ψάχνει: "Ποιος χειρίζεται το /api/clients;"           ↓
 *    3. Βρίσκει αυτή τη γραμμή: app.use("/api/clients", clientRoutes) ↓
 *    4. Στέλνει το request → backend/routes/clientRoutes.js           ↓
 *    5. Το clientRoutes.js → backend/controllers/clientController.js  ↓
 *    6. Ο controller → backend/models/client.js (database query)      ↓
 *    7. Database → επιστρέφει τα δεδομένα                             ↓
 *    8. Controller → στέλνει JSON response                            ↓
 *    9. Backend → Frontend παίρνει τα δεδομένα                        ✅
 * 
 * @see {@link ./routes/appointmentRoutes.js} - Χειρίζεται /api/appointments/*
 * @see {@link ./routes/clientRoutes.js} - Χειρίζεται /api/clients/*
 * @see {@link ./routes/propertyRoutes.js} - Χειρίζεται /api/properties/*
 * @see {@link ./routes/userRoutes.js} - Χειρίζεται /api/users/*
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
  });
});

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

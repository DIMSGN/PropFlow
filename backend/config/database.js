const { Sequelize } = require("sequelize");

/**
 * Ρύθμιση σύνδεσης βάσης δεδομένων (Database Connection Configuration)
 *
 * Υποστηρίζει δύο τρόπους ρύθμισης:
 * 1. Χειροκίνητη ρύθμιση (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)
 * 2. Auto-injection από CleverCloud (MYSQL_ADDON_*)
 *
 * @module config/database
 */

// Φόρτωση ρυθμίσεων από environment variables (Load configuration from environment variables)
const dbConfig = {
  database: process.env.DB_NAME || process.env.MYSQL_ADDON_DB,
  username: process.env.DB_USER || process.env.MYSQL_ADDON_USER,
  password: process.env.DB_PASSWORD || process.env.MYSQL_ADDON_PASSWORD,
  host: process.env.DB_HOST || process.env.MYSQL_ADDON_HOST,
  port: parseInt(
    process.env.DB_PORT || process.env.MYSQL_ADDON_PORT || "3306",
    10
  ),
};

// Έλεγχος ότι όλες οι απαραίτητες μεταβλητές υπάρχουν (Validate required variables exist)
const requiredFields = ["database", "username", "password", "host"];
const missingFields = requiredFields.filter((field) => !dbConfig[field]);

if (missingFields.length > 0) {
  throw new Error(
    `❌ Missing required database configuration: ${missingFields.join(
      ", "
    )}. ` +
      `Please set DB_NAME, DB_USER, DB_PASSWORD, DB_HOST or ensure MySQL addon is linked.`
  );
}

// Δημιουργία Sequelize instance με βελτιστοποιημένες ρυθμίσεις (Create Sequelize instance with optimized settings)
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: "mysql",

    // Ρυθμίσεις connection pool για καλύτερη απόδοση (Connection pool settings for better performance)
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "10", 10),
      min: parseInt(process.env.DB_POOL_MIN || "2", 10),
      acquire: 30000, // Μέγιστος χρόνος αναμονής για connection (30s)
      idle: 10000, // Χρόνος πριν κλείσει idle connection (10s)
    },

    // SSL ρυθμίσεις για παραγωγή (SSL settings for production)
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : undefined,
      // Timeout ρυθμίσεις (Connection timeouts)
      connectTimeout: 20000,
    },

    // Logging: ενεργοποιημένο μόνο σε development (Logging: enabled only in development)
    logging: process.env.NODE_ENV === "production" ? false : console.log,

    // Timestamps σε UTC για συνέπεια (Timestamps in UTC for consistency)
    timezone: "+00:00",

    // Βελτιστοποίηση queries (Query optimization)
    define: {
      underscored: false,
      freezeTableName: true,
    },
  }
);

module.exports = sequelize;

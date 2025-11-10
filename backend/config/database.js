const { Sequelize } = require("sequelize");

/**
 * Ρύθμιση σύνδεσης βάσης δεδομένων (Database Connection Configuration)
 *
 * @module config/database
 */

// Φόρτωση ρυθμίσεων από environment variables (Load configuration from environment variables)
const dbConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(
    process.env.DB_PORT ||
      (process.env.DB_DIALECT === "postgres" ? "5432" : "3306"),
    10
  ),
  dialect: process.env.DB_DIALECT || "mysql",
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
    dialect: dbConfig.dialect,

    // Ρυθμίσεις connection pool για καλύτερη απόδοση (Connection pool settings for better performance)
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "10", 10),
      min: parseInt(process.env.DB_POOL_MIN || "2", 10),
      acquire: 30000, // Μέγιστος χρόνος αναμονής για connection (30s)
      idle: 10000, // Χρόνος πριν κλείσει idle connection (10s)
    },

    // SSL ρυθμίσεις για παραγωγή (SSL settings for production)
    dialectOptions:
      dbConfig.dialect === "postgres"
        ? {
            ssl:
              process.env.DB_SSL === "true"
                ? {
                    require: true,
                    rejectUnauthorized: false, // Required for Render PostgreSQL
                  }
                : false,
          }
        : {
            ssl:
              process.env.DB_SSL === "true"
                ? {
                    require: true,
                    rejectUnauthorized: false, // Required for Render MySQL
                  }
                : undefined,
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

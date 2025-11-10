/**
 * Client Model (Μοντέλο Πελάτη)
 *
 * Αναπαριστά τους πελάτες που ενδιαφέρονται για ακίνητα/golden visa.
 * Represents clients interested in properties/golden visa.
 *
 * @module models/client
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * Client Entity (Οντότητα Πελάτη)
 *
 * Πεδία:
 * - first_name, last_name: Όνομα πελάτη (Client name)
 * - email: Email επικοινωνίας (Contact email)
 * - phone: Τηλέφωνο (Phone number)
 * - nationality: Εθνικότητα (Nationality)
 * - passport_number: Αριθμός διαβατηρίου (Passport number)
 */
const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First name cannot be empty",
        },
        len: {
          args: [2, 100],
          msg: "First name must be between 2 and 100 characters",
        },
      },
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Last name cannot be empty",
        },
        len: {
          args: [2, 100],
          msg: "Last name must be between 2 and 100 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        name: "unique_client_email",
        msg: "This email is already registered",
      },
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
        notEmpty: {
          msg: "Email cannot be empty",
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[+]?[\d\s\-()]+$/,
          msg: "Phone number format is invalid",
        },
      },
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    passport_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: {
        name: "unique_client_passport",
        msg: "This passport number is already registered",
      },
      validate: {
        len: {
          args: [3, 50],
          msg: "Passport number must be between 3 and 50 characters",
        },
      },
    },
  },
  {
    timestamps: true, // Προσθήκη createdAt, updatedAt (Add createdAt, updatedAt)
    tableName: "Clients",
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "idx_client_email",
      },
      {
        unique: true,
        fields: ["passport_number"],
        name: "idx_client_passport",
      },
      {
        fields: ["nationality"],
        name: "idx_client_nationality",
      },
      {
        fields: ["last_name", "first_name"],
        name: "idx_client_name",
      },
    ],
  }
);

/**
 * Instance Methods (Μέθοδοι Instance)
 */

/**
 * Επιστρέφει το πλήρες όνομα πελάτη (Return full name)
 */
Client.prototype.getFullName = function () {
  return `${this.first_name} ${this.last_name}`;
};

module.exports = Client;

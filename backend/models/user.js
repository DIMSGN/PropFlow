/**
 * User Model (Μοντέλο Χρήστη)
 *
 * Αναπαριστά τους χρήστες του συστήματος (admin, agents).
 * Represents system users (admins, agents).
 *
 * @module models/user
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * User Entity (Οντότητα Χρήστη)
 *
 * Πεδία:
 * - full_name: Πλήρες όνομα χρήστη (Full name)
 * - email: Email (μοναδικό, για login)
 * - password_hash: Κρυπτογραφημένος κωδικός (Hashed password)
 * - role: Ρόλος χρήστη (admin/agent)
 * - is_active: Ενεργός λογαριασμός (Active account flag)
 */
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Full name cannot be empty",
        },
        len: {
          args: [2, 200],
          msg: "Full name must be between 2 and 200 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        name: "unique_user_email",
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
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password hash cannot be empty",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "agent"),
      defaultValue: "agent",
      allowNull: false,
      validate: {
        isIn: {
          args: [["admin", "agent"]],
          msg: "Role must be either 'admin' or 'agent'",
        },
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Προσθήκη createdAt, updatedAt (Add createdAt, updatedAt)
    tableName: "Users",
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "idx_user_email",
      },
      {
        fields: ["role"],
        name: "idx_user_role",
      },
      {
        fields: ["is_active"],
        name: "idx_user_active",
      },
    ],
  }
);

/**
 * Instance Methods (Μέθοδοι Instance)
 */

/**
 * Επιστρέφει το user object χωρίς το password hash (Return user without password)
 * Χρησιμοποιείται για ασφαλείς API responses.
 * Used for safe API responses.
 */
User.prototype.toSafeObject = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  return values;
};

module.exports = User;

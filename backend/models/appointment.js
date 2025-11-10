const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Appointment = sequelize.define(
  "Appointment",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "confirmed", "completed", "cancelled"),
      defaultValue: "scheduled",
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Clients",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Properties",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    assignedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "Appointments",
    timestamps: true,
    indexes: [
      {
        fields: ["startDate"],
        name: "idx_appointment_start_date",
      },
      {
        fields: ["endDate"],
        name: "idx_appointment_end_date",
      },
      {
        fields: ["startDate", "endDate"],
        name: "idx_appointment_date_range",
      },
      {
        fields: ["status"],
        name: "idx_appointment_status",
      },
      {
        fields: ["clientId"],
        name: "idx_appointment_client",
      },
      {
        fields: ["propertyId"],
        name: "idx_appointment_property",
      },
      {
        fields: ["assignedUserId"],
        name: "idx_appointment_user",
      },
    ],
  }
);

// Note: Relationships are defined in models/index.js

module.exports = Appointment;

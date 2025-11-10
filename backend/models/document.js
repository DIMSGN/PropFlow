const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Document = sequelize.define(
  "Document",
  {
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "passport",
        "visa",
        "contract",
        "financial",
        "property_deed",
        "other"
      ),
      defaultValue: "other",
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Clients",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Appointments",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    uploadedBy: {
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
    timestamps: true,
    indexes: [
      {
        fields: ["clientId"],
        name: "idx_document_client",
      },
      {
        fields: ["type"],
        name: "idx_document_type",
      },
      {
        fields: ["uploadedBy"],
        name: "idx_document_uploaded_by",
      },
    ],
  }
);

module.exports = Document;

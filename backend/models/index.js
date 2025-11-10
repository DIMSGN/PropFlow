/**
 * Κεντρικό αρχείο Models (Central Models File)
 *
 * Εισάγει όλα τα models και ορίζει τις σχέσεις μεταξύ τους.
 * Imports all models and defines relationships between them.
 *
 * @module models/index
 */

const sequelize = require("../config/database");

// Εισαγωγή όλων των models (Import all models)
const Client = require("./client");
const Property = require("./property");
const User = require("./user");
const Appointment = require("./appointment");
const Document = require("./document");

/**
 * Ορισμός Σχέσεων Βάσης Δεδομένων (Database Relationships Definition)
 *
 * Η δομή ακολουθεί το μοντέλο:
 * - Client (Πελάτης): Κεντρική οντότητα, έχει ραντεβού, ιδιοκτησίες, έγγραφα
 * - Property (Ακίνητο): Ανήκει σε πελάτη, έχει ραντεβού
 * - User (Χρήστης): Διαχειριστής/Agent, υπεύθυνος για ραντεβού
 * - Appointment (Ραντεβού): Συνδέει client, property, user
 * - Document (Έγγραφο): Συνδέεται με client, appointment
 */

// ==================== Client Relationships ====================

// Ένας πελάτης έχει πολλά ραντεβού (One client has many appointments)
Client.hasMany(Appointment, {
  foreignKey: "clientId",
  as: "appointments",
  onDelete: "SET NULL", // Αν διαγραφεί ο πελάτης, το ραντεβού μένει αλλά χωρίς πελάτη
});

// Ένας πελάτης έχει πολλά έγγραφα (One client has many documents)
Client.hasMany(Document, {
  foreignKey: "clientId",
  as: "documents",
  onDelete: "CASCADE", // Αν διαγραφεί ο πελάτης, διαγράφονται και τα έγγραφά του
});

// Ένας πελάτης έχει πολλές ιδιοκτησίες (One client has many properties)
Client.hasMany(Property, {
  foreignKey: "clientId",
  as: "properties",
  onDelete: "SET NULL", // Αν διαγραφεί ο πελάτης, η ιδιοκτησία μένει
});

// ==================== Property Relationships ====================

// Μια ιδιοκτησία έχει πολλά ραντεβού (One property has many appointments)
Property.hasMany(Appointment, {
  foreignKey: "propertyId",
  as: "appointments",
  onDelete: "SET NULL", // Αν διαγραφεί η ιδιοκτησία, το ραντεβού μένει
});

// Μια ιδιοκτησία ανήκει σε έναν πελάτη (One property belongs to one client)
Property.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

// ==================== User Relationships ====================

// Ένας χρήστης (agent) έχει πολλά ραντεβού που του έχουν ανατεθεί
// One user (agent) has many assigned appointments
User.hasMany(Appointment, {
  foreignKey: "assignedUserId",
  as: "appointments",
  onDelete: "SET NULL", // Αν διαγραφεί ο χρήστης, το ραντεβού μένει
});

// Ένας χρήστης έχει ανεβάσει πολλά έγγραφα (One user has uploaded many documents)
User.hasMany(Document, {
  foreignKey: "uploadedBy",
  as: "uploadedDocuments",
  onDelete: "SET NULL", // Αν διαγραφεί ο χρήστης, τα έγγραφα μένουν
});

// ==================== Appointment Relationships ====================

// Ένα ραντεβού ανήκει σε έναν πελάτη (One appointment belongs to one client)
Appointment.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

// Ένα ραντεβού αφορά μια ιδιοκτησία (One appointment is for one property)
Appointment.belongsTo(Property, {
  foreignKey: "propertyId",
  as: "property",
});

// Ένα ραντεβού έχει ανατεθεί σε έναν χρήστη (One appointment is assigned to one user)
Appointment.belongsTo(User, {
  foreignKey: "assignedUserId",
  as: "assignedAgent",
});

// Ένα ραντεβού έχει πολλά έγγραφα (One appointment has many documents)
Appointment.hasMany(Document, {
  foreignKey: "appointmentId",
  as: "documents",
  onDelete: "CASCADE", // Αν διαγραφεί το ραντεβού, διαγράφονται και τα έγγραφά του
});

// ==================== Document Relationships ====================

// Ένα έγγραφο ανήκει σε έναν πελάτη (One document belongs to one client)
Document.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

// Ένα έγγραφο ανήκει σε ένα ραντεβού (One document belongs to one appointment)
Document.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointment",
});

// Ένα έγγραφο έχει ανέβει από έναν χρήστη (One document was uploaded by one user)
Document.belongsTo(User, {
  foreignKey: "uploadedBy",
  as: "uploader",
});

/**
 * Export όλων των models και της σύνδεσης (Export all models and connection)
 */
module.exports = {
  sequelize,
  Client,
  Property,
  User,
  Appointment,
  Document,
};

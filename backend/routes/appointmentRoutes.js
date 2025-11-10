const express = require("express");
const AppointmentController = require("../controllers/appointmentController");
const {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateAppointmentId,
  validateDocumentName,
} = require("../middleware/validation");

const router = express.Router();

// Create an appointment
router.post(
  "/",
  validateCreateAppointment,
  AppointmentController.createAppointment
);

// Get all appointments
router.get("/", AppointmentController.getAllAppointments);

// Get a specific appointment by ID
router.get(
  "/:id",
  validateAppointmentId,
  AppointmentController.getAppointmentById
);

// Update an appointment by ID
router.put(
  "/:id",
  validateUpdateAppointment,
  AppointmentController.updateAppointment
);

// Delete an appointment by ID
router.delete(
  "/:id",
  validateAppointmentId,
  AppointmentController.deleteAppointment
);

// Upload a document for an appointment
router.post(
  "/:id/upload",
  validateAppointmentId,
  AppointmentController.uploadDocument
);

// Get document names for an appointment
router.get(
  "/:id/documents",
  validateAppointmentId,
  AppointmentController.getDocumentNames
);

// Delete a document by name
router.delete(
  "/:id/documents/:documentName",
  validateDocumentName,
  AppointmentController.deleteDocument
);

module.exports = router;

const { body, param, validationResult } = require("express-validator");

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for creating appointments
const validateCreateAppointment = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  validate,
];

// Validation rules for updating appointments
const validateUpdateAppointment = [
  param("id").isInt().withMessage("Invalid appointment ID"),
  ...validateCreateAppointment,
];

// Validation rules for appointment ID parameter
const validateAppointmentId = [
  param("id").isInt().withMessage("Invalid appointment ID"),
  validate,
];

// Validation rules for document name
const validateDocumentName = [
  param("id").isInt().withMessage("Invalid appointment ID"),
  param("documentName")
    .notEmpty()
    .withMessage("Document name is required")
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage("Invalid document name format"),
  validate,
];

module.exports = {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateAppointmentId,
  validateDocumentName,
  validate,
};

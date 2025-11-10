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

// Validation rules for creating clients
const validateCreateClient = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("First name must be between 2 and 100 characters"),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Last name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("phone")
    .optional()
    .trim()
    .matches(/^[+]?[\d\s\-()]+$/)
    .withMessage("Invalid phone number format"),
  body("nationality")
    .trim()
    .notEmpty()
    .withMessage("Nationality is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Nationality must be between 2 and 50 characters"),
  body("passport_number")
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Passport number must be between 5 and 20 characters"),
  validate,
];

// Validation rules for updating clients
const validateUpdateClient = [
  param("id").isInt().withMessage("Invalid client ID"),
  ...validateCreateClient,
];

// Validation rules for client ID parameter
const validateClientId = [
  param("id").isInt().withMessage("Invalid client ID"),
  validate,
];

// Validation rules for creating properties
const validateCreateProperty = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description must not exceed 2000 characters"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),
  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("propertyType")
    .optional()
    .trim()
    .isIn(["apartment", "house", "commercial", "land", "other"])
    .withMessage("Invalid property type"),
  body("status")
    .optional()
    .trim()
    .isIn(["available", "under_contract", "sold"])
    .withMessage("Invalid status"),
  validate,
];

// Validation rules for updating properties
const validateUpdateProperty = [
  param("id").isInt().withMessage("Invalid property ID"),
  ...validateCreateProperty,
];

// Validation rules for property ID parameter
const validatePropertyId = [
  param("id").isInt().withMessage("Invalid property ID"),
  validate,
];

module.exports = {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateAppointmentId,
  validateDocumentName,
  validateCreateClient,
  validateUpdateClient,
  validateClientId,
  validateCreateProperty,
  validateUpdateProperty,
  validatePropertyId,
  validate,
};

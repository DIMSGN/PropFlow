const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const {
  validateCreateProperty,
  validateUpdateProperty,
  validatePropertyId,
} = require("../middleware/validation");

// Property routes - IMPORTANT: /stats must come before /:id
router.get("/stats", propertyController.getPropertyStats);
router.get("/", propertyController.getAllProperties);
router.get("/:id", validatePropertyId, propertyController.getPropertyById);
router.post("/", validateCreateProperty, propertyController.createProperty);
router.put("/:id", validateUpdateProperty, propertyController.updateProperty);
router.delete("/:id", validatePropertyId, propertyController.deleteProperty);

module.exports = router;

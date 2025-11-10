const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

// Property routes - IMPORTANT: /stats must come before /:id
router.get("/stats", propertyController.getPropertyStats);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.post("/", propertyController.createProperty);
router.put("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;

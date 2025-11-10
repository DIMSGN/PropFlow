const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const {
  validateCreateClient,
  validateUpdateClient,
  validateClientId,
} = require("../middleware/validation");

// Client routes - IMPORTANT: /stats must come before /:id
router.get("/stats", clientController.getClientStats);
router.get("/", clientController.getAllClients);
router.get("/:id", validateClientId, clientController.getClientById);
router.post("/", validateCreateClient, clientController.createClient);
router.put("/:id", validateUpdateClient, clientController.updateClient);
router.delete("/:id", validateClientId, clientController.deleteClient);

module.exports = router;

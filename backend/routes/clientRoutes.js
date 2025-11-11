/**
 * ============================================================================
 * CLIENT ROUTES - Τα "Κουδούνια" της Πόρτας /api/clients
 * CLIENT ROUTES - The "Doorbells" of the /api/clients Door
 * ============================================================================
 * 
 * 🚪 ΤΙ ΕΙΝΑΙ: Ορισμός των HTTP methods (GET, POST, PUT, DELETE) για clients
 * 🚪 WHAT IS: Definition of HTTP methods (GET, POST, PUT, DELETE) for clients
 * 
 * 📖 ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ:
 *    Το server.js είπε: "Ότι αρχίζει με /api/clients, στείλτο εδώ"
 *    Αυτό το file λέει: "Ωραία, τώρα τι ΑΚΡΙΒΩΣ θέλεις;"
 * 
 * 🔄 HTTP METHODS (Τι σημαίνει το καθένα):
 *    - GET    = "Θέλω να ΔΙΑΒΑΣΩ δεδομένα" (δεν αλλάζει τίποτα)
 *    - POST   = "Θέλω να ΔΗΜΙΟΥΡΓΗΣΩ νέα δεδομένα"
 *    - PUT    = "Θέλω να ΑΛΛΑΞΩ υπάρχοντα δεδομένα"
 *    - DELETE = "Θέλω να ΣΒΗΣΩ δεδομένα"
 * 
 * 📍 ROUTES MAPPING (Τι κάνει το καθένα):
 * 
 * @route GET /api/clients/stats
 *        Frontend: axios.get("https://propflow.../api/clients/stats")
 *        Backend: Καλεί → clientController.getClientStats()
 *        Αποτέλεσμα: { total: 5, nationalities: [...], ... }
 * 
 * @route GET /api/clients
 *        Frontend: axios.get("https://propflow.../api/clients")
 *        Backend: Καλεί → clientController.getAllClients()
 *        Αποτέλεσμα: [ {id:1, first_name:"Δημήτρης"}, {id:2, ...}, ... ]
 * 
 * @route GET /api/clients/:id
 *        Frontend: axios.get("https://propflow.../api/clients/5")
 *        Backend: Καλεί → clientController.getClientById(5)
 *        Αποτέλεσμα: { id:5, first_name:"Δημήτρης", email:"test@...", ... }
 * 
 * @route POST /api/clients
 *        Frontend: axios.post("https://propflow.../api/clients", {first_name:"Maria", ...})
 *        Backend: Καλεί → clientController.createClient(req.body)
 *        Αποτέλεσμα: { id:6, first_name:"Maria", ... } (ο νέος client με ID)
 * 
 * @route PUT /api/clients/:id
 *        Frontend: axios.put("https://propflow.../api/clients/5", {email:"new@email.com"})
 *        Backend: Καλεί → clientController.updateClient(5, req.body)
 *        Αποτέλεσμα: { id:5, email:"new@email.com", ... } (ο updated client)
 * 
 * @route DELETE /api/clients/:id
 *        Frontend: axios.delete("https://propflow.../api/clients/5")
 *        Backend: Καλεί → clientController.deleteClient(5)
 *        Αποτέλεσμα: { message: "Client deleted successfully" }
 * 
 * ⚠️ ΣΗΜΑΝΤΙΚΟ: Η σειρά έχει σημασία!
 *    Το /stats ΠΡΕΠΕΙ να είναι ΠΡΙΝ το /:id
 *    Γιατί; Αν ήταν ανάποδα, το Express θα νόμιζε ότι "stats" είναι ένα ID!
 *    
 * 📝 ΠΑΡΑΔΕΙΓΜΑ ΛΑΘΟΥΣ:
 *    ❌ router.get("/:id", ...)    // Αυτό πρώτα
 *       router.get("/stats", ...)  // Αυτό μετά → ΔΕΝ ΘΑ ΔΟΥΛΕΨΕΙ!
 *    
 *    ✅ router.get("/stats", ...)  // Συγκεκριμένο path πρώτα
 *       router.get("/:id", ...)    // Wildcard μετά → ΣΩΣΤΟ!
 */
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Client routes - IMPORTANT: /stats must come before /:id
router.get("/stats", clientController.getClientStats);
router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getClientById);
router.post("/", clientController.createClient);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

module.exports = router;

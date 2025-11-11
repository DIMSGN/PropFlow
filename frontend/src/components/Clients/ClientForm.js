/**
 * ============================================================================
 * CLIENT FORM COMPONENT - Φόρμα Δημιουργίας/Επεξεργασίας Client
 * CLIENT FORM COMPONENT - Create/Edit Client Form
 * ============================================================================
 * 
 * 📝 ΤΙ ΚΑΝΕΙ: Modal dialog με φόρμα για:
 *    - CREATE: Δημιουργία νέου client (αν props.client === null)
 *    - UPDATE: Επεξεργασία υπάρχοντος client (αν props.client υπάρχει)
 * 
 * 🔄 ΠΩΣ ΣΥΝΔΕΕΤΑΙ:
 *    1. Το ClientList.js το καλεί: <ClientForm open={true} client={...} />
 *    2. Αυτό στέλνει POST ή PUT request στο backend
 *    3. Καλεί το onClose(true) για να ειδοποιήσει το parent να κάνει refresh
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.open - Αν το dialog είναι ανοιχτό
 * @param {Object|null} props.client - Ο client για edit, ή null για create
 * @param {Function} props.onClose - Callback: onClose(saved:boolean)
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { API_ENDPOINTS } from "../../config/api";

const ClientForm = ({ open, client, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    passport_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (client) {
      setFormData({
        first_name: client.first_name || "",
        last_name: client.last_name || "",
        email: client.email || "",
        phone: client.phone || "",
        nationality: client.nationality || "",
        passport_number: client.passport_number || "",
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        nationality: "",
        passport_number: "",
      });
    }
    setError("");
  }, [client, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * ============================================================================
   * ΣΗΜΕΙΟ ΣΥΝΔΕΣΗΣ #3 & #4: CREATE/UPDATE - Αποθήκευση Client
   * CONNECTION POINT #3 & #4: CREATE/UPDATE - Save Client
   * ============================================================================
   * 
   * 🎯 ΤΙ ΚΑΝΕΙ: Ανάλογα με το αν υπάρχει client, κάνει:
   *    - CREATE (POST): Δημιουργεί νέο client
   *    - UPDATE (PUT): Ενημερώνει υπάρχοντα client
   * 
   * 📡 FLOW για CREATE:
   *    1. User: Γεμίζει τη φόρμα → Πατάει "Save"
   *    2. Frontend: handleSubmit() → axios.post(CLIENTS, formData)
   *       → Στέλνει: POST https://propflow.../api/clients
   *       → Body: { first_name: "Δημήτρης", email: "...", passport_number: "AB123456", ... }
   *    3. Backend: clientRoutes.js → router.post("/", createClient)
   *    4. Controller: clientController.createClient(req.body)
   *       → Validation: Ελέγχει αν passport_number είναι 3-50 chars
   *       → Database: INSERT INTO clients (first_name, ...) VALUES (...)
   *    5. Database: Δημιουργεί τον client → Επιστρέφει με ID
   *    6. Backend: res.status(201).json({ id: 6, first_name: "Δημήτρης", ... })
   *    7. Frontend: Παίρνει response → onClose(true) → ClientList refresh
   * 
   * 📡 FLOW για UPDATE:
   *    1. User: Αλλάζει email → Πατάει "Save"
   *    2. Frontend: axios.put(CLIENT_BY_ID(5), formData)
   *       → Στέλνει: PUT https://propflow.../api/clients/5
   *       → Body: { email: "new@email.com", ... }
   *    3. Backend: clientRoutes.js → router.put("/:id", updateClient)
   *    4. Controller: clientController.updateClient(5, req.body)
   *       → Database: UPDATE clients SET email='new@...' WHERE id=5
   *    5. Backend: res.json({ id: 5, email: "new@email.com", ... })
   *    6. Frontend: onClose(true) → Refresh
   * 
   * ⚠️ ERROR HANDLING:
   *    - Validation errors: Backend στέλνει 400 με details
   *    - Unique constraint: Email ή passport_number υπάρχει ήδη
   *    - Network errors: Backend down ή timeout
   * 
   * @async
   * @function handleSubmit
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Submitting client data:", formData);

      if (client) {
        // ========== UPDATE (PUT) ==========
        // 🌐 HTTP REQUEST: PUT https://propflow.../api/clients/{id}
        // 📦 BODY: { first_name, last_name, email, phone, nationality, passport_number }
        await axios.put(API_ENDPOINTS.CLIENT_BY_ID(client.id), formData);
      } else {
        // ========== CREATE (POST) ==========
        // 🌐 HTTP REQUEST: POST https://propflow.../api/clients
        // 📦 BODY: { first_name, last_name, email, phone, nationality, passport_number }
        await axios.post(API_ENDPOINTS.CLIENTS, formData);
      }
      
      // ✅ SUCCESS: Κλείνει το form ΚΑΙ λέει στο parent να κάνει refresh
      onClose(true);
    } catch (err) {
      console.error("Client form error:", err.response?.data);

      // ❌ ERROR HANDLING: Μορφοποίηση του error message
      let errorMessage = "Failed to save client";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;

        // Add validation details if available
        if (
          err.response.data.details &&
          Array.isArray(err.response.data.details)
        ) {
          const detailMessages = err.response.data.details
            .map((d) => `${d.field}: ${d.message}`)
            .join(", ");
          errorMessage += ` - ${detailMessages}`;
        } else if (err.response.data.details) {
          errorMessage += ` - ${err.response.data.details}`;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Passport Number"
                name="passport_number"
                value={formData.passport_number}
                onChange={handleChange}
                required
                disabled={loading}
                inputProps={{ minLength: 3, maxLength: 50 }}
                helperText="Required: 3-50 characters"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ClientForm.propTypes = {
  open: PropTypes.bool.isRequired,
  client: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    nationality: PropTypes.string,
    passport_number: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ClientForm;

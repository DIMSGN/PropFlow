/**
 * ============================================================================
 * CLIENT LIST COMPONENT - Λίστα Πελατών με CRUD Operations
 * CLIENT LIST COMPONENT - Client List with CRUD Operations
 * ============================================================================
 * 
 * 📋 ΤΙ ΚΑΝΕΙ: Εμφανίζει όλους τους clients σε πίνακα με δυνατότητα:
 *    - Προβολής (READ)
 *    - Δημιουργίας νέου (CREATE)
 *    - Επεξεργασίας (UPDATE)
 *    - Διαγραφής (DELETE)
 * 
 * 🔄 ΠΩΣ ΣΥΝΔΕΕΤΑΙ ΜΕ ΤΟ BACKEND:
 *    1. Εισάγει (import) το API_ENDPOINTS από το config/api.js
 *    2. Χρησιμοποιεί την βιβλιοθήκη axios για HTTP requests
 *    3. Καλεί τα backend endpoints μέσω functions
 * 
 * @component
 * @requires axios - HTTP client για requests (αντί για fetch API)
 * @requires API_ENDPOINTS - Οι διευθύνσεις του backend
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  TextField,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { API_ENDPOINTS } from "../../config/api";
import ClientForm from "./ClientForm";
import "./ClientList.css";

const ClientList = () => {
  // ========== STATE MANAGEMENT ==========
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    client: null,
  });
  const [orderBy, setOrderBy] = useState("first_name");
  const [order, setOrder] = useState("asc");

  /**
   * ============================================================================
   * COMPONENT LIFECYCLE: useEffect - Τρέχει όταν φορτώνει το component
   * COMPONENT LIFECYCLE: useEffect - Runs when component loads
   * ============================================================================
   * 
   * 🔄 ΤΙ ΚΑΝΕΙ: Μόλις ανοίξει η σελίδα, καλεί αυτόματα το fetchClients()
   *    για να φορτώσει τους clients από το backend
   * 
   * 📍 DEPENDENCY ARRAY []:
   *    Το [] σημαίνει "τρέξε ΜΟΝΟ μια φορά όταν το component φορτώσει"
   *    Αν έλειπε το [], θα έτρεχε ξανά και ξανά (infinite loop!)
   */
  useEffect(() => {
    fetchClients();
  }, []);

  /**
   * ============================================================================
   * ΣΗΜΕΙΟ ΣΥΝΔΕΣΗΣ #1: FETCH (READ) - Φέρνει ΟΛΟΥΣ τους Clients
   * CONNECTION POINT #1: FETCH (READ) - Retrieves ALL Clients
   * ============================================================================
   * 
   * 🎯 ΤΙ ΚΑΝΕΙ: Στέλνει GET request στο backend για να πάρει τη λίστα
   * 
   * 📡 FLOW:
   *    1. Frontend: axios.get(API_ENDPOINTS.CLIENTS)
   *       → Στέλνει: GET https://propflow-8k3o.onrender.com/api/clients
   *    
   *    2. Backend: Παίρνει το request στο server.js
   *       → Βλέπει "/api/clients" → Στέλνει στο clientRoutes.js
   *    
   *    3. clientRoutes.js: Βλέπει GET "/" (root του /api/clients)
   *       → Καλεί clientController.getAllClients()
   *    
   *    4. clientController.getAllClients(): 
   *       → Κάνει database query: SELECT * FROM clients
   *       → Παίρνει τα δεδομένα από PostgreSQL
   *       → Στέλνει response: res.json(clients)
   *    
   *    5. Frontend: Παίρνει την απάντηση
   *       → response.data = [ {id:1, name:"..."}, {id:2, ...}, ... ]
   *       → setClients(response.data) → Ενημερώνει το UI
   * 
   * @async
   * @function fetchClients
   * @description Διαβάζει όλους τους clients από το backend
   * @throws {Error} Αν το backend δεν είναι διαθέσιμο ή επιστρέψει error
   */
  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // 🌐 HTTP REQUEST: GET https://propflow-8k3o.onrender.com/api/clients
      const response = await axios.get(API_ENDPOINTS.CLIENTS);
      
      // ✅ SUCCESS: Αποθηκεύει τα δεδομένα στο state
      setClients(response.data);
      setError("");
    } catch (err) {
      // ❌ ERROR: Αν το backend δεν απαντήσει ή δώσει error
      setError("Failed to load clients");
      console.error(err);
    } finally {
      // ⏱️ FINALLY: Πάντα σταματάει το loading (επιτυχία ή αποτυχία)
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedClient(null);
    setOpenForm(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setOpenForm(true);
  };

  /**
   * ============================================================================
   * ΣΗΜΕΙΟ ΣΥΝΔΕΣΗΣ #2: DELETE - Διαγράφει Client από το Backend
   * CONNECTION POINT #2: DELETE - Deletes Client from Backend
   * ============================================================================
   * 
   * 🎯 ΤΙ ΚΑΝΕΙ: Στέλνει DELETE request για να σβήσει client
   * 
   * 📡 FLOW:
   *    1. User: Πατάει το delete icon → Εμφανίζεται confirmation dialog
   *    2. User: Επιβεβαιώνει → Καλείται αυτή η function
   *    3. Frontend: axios.delete(API_ENDPOINTS.CLIENT_BY_ID(5))
   *       → Στέλνει: DELETE https://propflow.../api/clients/5
   *    4. Backend: clientRoutes.js → router.delete("/:id", deleteClient)
   *       → clientController.deleteClient(5)
   *    5. Database: DELETE FROM clients WHERE id = 5
   *    6. Backend: res.json({ message: "Client deleted" })
   *    7. Frontend: Αφαιρεί τον client από το UI (filter)
   * 
   * @async
   * @function handleDelete
   * @description Διαγράφει client από database ΚΑΙ από το UI
   */
  const handleDelete = async () => {
    const { client } = deleteDialog;
    try {
      // 🌐 HTTP REQUEST: DELETE https://propflow.../api/clients/{id}
      await axios.delete(API_ENDPOINTS.CLIENT_BY_ID(client.id));
      
      // ✅ SUCCESS: Αφαιρεί τον client από το local state (UI update)
      setClients(clients.filter((c) => c.id !== client.id));
      setDeleteDialog({ open: false, client: null });
    } catch (err) {
      // ❌ ERROR: Εμφανίζει error message
      setError("Failed to delete client");
      console.error(err);
    }
  };

  /**
   * @function handleFormClose
   * @description Callback όταν κλείσει το ClientForm modal
   * @param {boolean} saved - True αν αποθηκεύτηκε, false αν έκλεισε χωρίς save
   * 
   * 🔄 ΠΩΣ ΔΟΥΛΕΥΕΙ:
   *    - Αν saved=true → Ξανακαλεί fetchClients() για refresh της λίστας
   *    - Αν saved=false → Απλά κλείνει το dialog
   */
  const handleFormClose = (saved) => {
    setOpenForm(false);
    setSelectedClient(null);
    if (saved) {
      fetchClients();
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    // Handle name sorting
    if (orderBy === "name") {
      aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
      bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
    } else {
      aValue = (aValue || "").toString().toLowerCase();
      bValue = (bValue || "").toString().toLowerCase();
    }

    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // Filter and sort clients
  const filteredClients = stableSort(
    clients.filter(
      (client) =>
        client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nationality?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    getComparator(order, orderBy)
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, maxWidth: "1600px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Clients
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Client
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or nationality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "action.active" }} />
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "email"}
                  direction={orderBy === "email" ? order : "asc"}
                  onClick={() => handleRequestSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "phone"}
                  direction={orderBy === "phone" ? order : "asc"}
                  onClick={() => handleRequestSort("phone")}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "nationality"}
                  direction={orderBy === "nationality" ? order : "asc"}
                  onClick={() => handleRequestSort("nationality")}
                >
                  Nationality
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "passport_number"}
                  direction={orderBy === "passport_number" ? order : "asc"}
                  onClick={() => handleRequestSort("passport_number")}
                >
                  Passport
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell>
                    {client.first_name} {client.last_name}
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || "-"}</TableCell>
                  <TableCell>
                    <Chip label={client.nationality} size="small" />
                  </TableCell>
                  <TableCell>{client.passport_number || "-"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(client)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, client })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ClientForm
        open={openForm}
        client={selectedClient}
        onClose={handleFormClose}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, client: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {deleteDialog.client?.first_name}{" "}
          {deleteDialog.client?.last_name}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, client: null })}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientList;

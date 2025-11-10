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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { API_ENDPOINTS } from "../../config/api";
import { formatCurrency } from "../../utils/formatters";
import { PROPERTY_STATUS } from "../../constants/propertyStatus";
import PropertyForm from "./PropertyForm";
import "./PropertyList.css";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    property: null,
  });
  const [orderBy, setOrderBy] = useState("title");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.PROPERTIES);
      setProperties(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load properties");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedProperty(null);
    setOpenForm(true);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    const { property } = deleteDialog;
    try {
      await axios.delete(API_ENDPOINTS.PROPERTY_BY_ID(property.id));
      setProperties(properties.filter((p) => p.id !== property.id));
      setDeleteDialog({ open: false, property: null });
    } catch (err) {
      setError("Failed to delete property");
      console.error(err);
    }
  };

  const handleFormClose = (saved) => {
    setOpenForm(false);
    setSelectedProperty(null);
    if (saved) {
      fetchProperties();
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
    let aValue, bValue;

    // Handle nested client name
    if (orderBy === "client") {
      aValue = a.client
        ? `${a.client.first_name} ${a.client.last_name}`.toLowerCase()
        : "";
      bValue = b.client
        ? `${b.client.first_name} ${b.client.last_name}`.toLowerCase()
        : "";
    } else if (orderBy === "price") {
      aValue = a[orderBy] || 0;
      bValue = b[orderBy] || 0;
    } else {
      aValue = (a[orderBy] || "").toString().toLowerCase();
      bValue = (b[orderBy] || "").toString().toLowerCase();
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

  // Filter properties
  const filteredProperties = stableSort(
    properties.filter((property) => {
      const matchesSearch =
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || property.status === statusFilter;

      return matchesSearch && matchesStatus;
    }),
    getComparator(order, orderBy)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case PROPERTY_STATUS.AVAILABLE:
        return "success";
      case PROPERTY_STATUS.RESERVED:
        return "warning";
      case PROPERTY_STATUS.SOLD:
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, maxWidth: "1700px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Properties
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Property
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by title, city, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="reserved">Reserved</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "title"}
                  direction={orderBy === "title" ? order : "asc"}
                  onClick={() => handleRequestSort("title")}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "city"}
                  direction={orderBy === "city" ? order : "asc"}
                  onClick={() => handleRequestSort("city")}
                >
                  City
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "address"}
                  direction={orderBy === "address" ? order : "asc"}
                  onClick={() => handleRequestSort("address")}
                >
                  Address
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "price"}
                  direction={orderBy === "price" ? order : "asc"}
                  onClick={() => handleRequestSort("price")}
                >
                  Price (€)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "client"}
                  direction={orderBy === "client" ? order : "asc"}
                  onClick={() => handleRequestSort("client")}
                >
                  Client
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property.id} hover>
                  <TableCell>{property.title}</TableCell>
                  <TableCell>{property.city}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(property.price)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={property.status}
                      color={getStatusColor(property.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {property.client ? (
                      <div>
                        <div style={{ fontWeight: 500 }}>
                          {property.client.first_name}{" "}
                          {property.client.last_name}
                        </div>
                        <div style={{ fontSize: "0.85em", color: "#666" }}>
                          {property.client.email}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: "#999" }}>—</span>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(property)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, property })}
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

      <PropertyForm
        open={openForm}
        property={selectedProperty}
        onClose={handleFormClose}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, property: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {deleteDialog.property?.title}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, property: null })}
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

export default PropertyList;

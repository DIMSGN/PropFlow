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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { API_ENDPOINTS } from "../../config/api";

const PropertyForm = ({ open, property, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    price: "",
    description: "",
    status: "available",
    clientId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CLIENTS);
      setClients(response.data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  useEffect(() => {
    if (property) {
      const clientId = property.clientId || property.client?.id || "";
      setFormData({
        title: property.title || "",
        address: property.address || "",
        city: property.city || "",
        price: property.price || "",
        description: property.description || "",
        status: property.status || "available",
        clientId: clientId === "" ? "" : Number(clientId),
      });
    } else {
      setFormData({
        title: "",
        address: "",
        city: "",
        price: "",
        description: "",
        status: "available",
        clientId: "",
      });
    }
    setError("");
  }, [property, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert clientId to number or empty string
    const processedValue =
      name === "clientId" ? (value === "" ? "" : Number(value)) : value;

    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare data - convert empty clientId to null for backend
      const submitData = {
        ...formData,
        clientId: formData.clientId === "" ? null : formData.clientId,
      };

      if (property) {
        await axios.put(API_ENDPOINTS.PROPERTY_BY_ID(property.id), submitData);
      } else {
        await axios.post(API_ENDPOINTS.PROPERTIES, submitData);
      }
      onClose(true);
    } catch (err) {
      console.error("Error saving property:", err);
      setError(err.response?.data?.error || "Failed to save property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {property ? "Edit Property" : "Add New Property"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (€)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={loading}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="reserved">Reserved</MenuItem>
                  <MenuItem value="sold">Sold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {(formData.status === "reserved" || formData.status === "sold") && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    name="clientId"
                    value={formData.clientId}
                    label="Client"
                    onChange={handleChange}
                    disabled={loading}
                    required={
                      formData.status === "reserved" ||
                      formData.status === "sold"
                    }
                  >
                    <MenuItem value="">
                      <em>Select Client</em>
                    </MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.first_name} {client.last_name} - {client.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                disabled={loading}
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

PropertyForm.propTypes = {
  open: PropTypes.bool.isRequired,
  property: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    status: PropTypes.string,
    clientId: PropTypes.number,
    client: PropTypes.shape({
      id: PropTypes.number,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
};

export default PropertyForm;

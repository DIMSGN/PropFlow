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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (client) {
        await axios.put(API_ENDPOINTS.CLIENT_BY_ID(client.id), formData);
      } else {
        await axios.post(API_ENDPOINTS.CLIENTS, formData);
      }
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save client");
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

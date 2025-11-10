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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { API_ENDPOINTS } from "../../config/api";

const UserForm = ({ open, user, onClose }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "agent",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        password: "", // Don't populate password
        role: user.role || "agent",
        is_active: user.is_active !== undefined ? user.is_active : true,
      });
    } else {
      setFormData({
        full_name: "",
        email: "",
        password: "",
        role: "agent",
        is_active: true,
      });
    }
    setError("");
  }, [user, open]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = { ...formData };

      // Don't send empty password on edit
      if (user && !submitData.password) {
        delete submitData.password;
      }

      if (user) {
        await axios.put(API_ENDPOINTS.USER_BY_ID(user.id), submitData);
      } else {
        await axios.post(API_ENDPOINTS.USERS, submitData);
      }
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
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
                label="Full Name"
                name="full_name"
                value={formData.full_name}
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
                label={
                  user ? "Password (leave blank to keep current)" : "Password"
                }
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!user}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="agent">Agent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    disabled={loading}
                  />
                }
                label="Active"
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

UserForm.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    full_name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
};

export default UserForm;

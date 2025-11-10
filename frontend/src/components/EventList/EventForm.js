import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { APPOINTMENT_STATUS } from "../../constants/appointmentStatus";

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  startDate: null,
  endDate: null,
  selectedClient: "",
  selectedProperty: "",
  selectedAgent: "",
  status: APPOINTMENT_STATUS.SCHEDULED,
  notes: "",
};

const EventForm = ({ onSubmit }) => {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [clients, setClients] = useState([]);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CLIENTS);
      setClients(response.data);
    } catch (error) {
      console.error("Failed to load clients:", error);
    }
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PROPERTIES);
      setProperties(response.data);
    } catch (error) {
      console.error("Failed to load properties:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS);
      setUsers(response.data.filter((u) => u.is_active));
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClients();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchClients, fetchProperties, fetchUsers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      title: formState.title,
      description: formState.description,
      startDate: formState.startDate ? formState.startDate.toISOString() : null,
      endDate: formState.endDate ? formState.endDate.toISOString() : null,
      status: formState.status,
      notes: formState.notes,
      clientId: formState.selectedClient || null,
      propertyId: formState.selectedProperty || null,
      assignedUserId: formState.selectedAgent || user?.id || null,
    };

    onSubmit(eventData);
    setFormState(INITIAL_FORM_STATE);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <DialogTitle>Create New Appointment</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="appointment-form">
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  value={formState.title}
                  onChange={(e) =>
                    setFormState({ ...formState, title: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Start Date & Time"
                  value={formState.startDate}
                  onChange={(value) =>
                    setFormState({ ...formState, startDate: value })
                  }
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="End Date & Time"
                  value={formState.endDate}
                  onChange={(value) =>
                    setFormState({ ...formState, endDate: value })
                  }
                  minDateTime={formState.startDate}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Client (Optional)</InputLabel>
                  <Select
                    value={formState.selectedClient}
                    label="Client (Optional)"
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        selectedClient: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.first_name} {client.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Property (Optional)</InputLabel>
                  <Select
                    value={formState.selectedProperty}
                    label="Property (Optional)"
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        selectedProperty: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {properties.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.title} - {property.city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Assigned Agent</InputLabel>
                  <Select
                    value={formState.selectedAgent}
                    label="Assigned Agent"
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        selectedAgent: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="">
                      <em>Select Agent</em>
                    </MenuItem>
                    {users.map((agent) => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.full_name} ({agent.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formState.status}
                    label="Status"
                    onChange={(e) =>
                      setFormState({ ...formState, status: e.target.value })
                    }
                  >
                    <MenuItem value={APPOINTMENT_STATUS.SCHEDULED}>
                      Scheduled
                    </MenuItem>
                    <MenuItem value={APPOINTMENT_STATUS.CONFIRMED}>
                      Confirmed
                    </MenuItem>
                    <MenuItem value={APPOINTMENT_STATUS.COMPLETED}>
                      Completed
                    </MenuItem>
                    <MenuItem value={APPOINTMENT_STATUS.CANCELLED}>
                      Cancelled
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  value={formState.notes}
                  onChange={(e) =>
                    setFormState({ ...formState, notes: e.target.value })
                  }
                  multiline
                  rows={2}
                  placeholder="Additional notes..."
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onSubmit(null)}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="appointment-form"
          >
            Create Appointment
          </Button>
        </DialogActions>
      </>
    </LocalizationProvider>
  );
};

EventForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default EventForm;

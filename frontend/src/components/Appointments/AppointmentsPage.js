import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useEvents } from "../../hooks/useEvents";
import EventList from "../EventList/EventList";
import EventForm from "../EventList/EventForm";

const AppointmentsPage = () => {
  const { events, loading, error, createEvent, fetchEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);

  const handleAdd = () => {
    setOpenForm(true);
  };

  const handleFormClose = async (eventData) => {
    if (eventData) {
      await createEvent(eventData);
      fetchEvents();
    }
    setOpenForm(false);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.client?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      event.client?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      event.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.assignedAgent?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      event.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3, maxWidth: "98vw" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Appointments
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Appointment
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
          placeholder="Search by title, description, client, property, agent, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "action.active" }} />
            ),
          }}
        />
      </Paper>

      <EventList events={filteredEvents} onEventUpdated={fetchEvents} />

      <Dialog
        open={openForm}
        onClose={() => handleFormClose(null)}
        maxWidth="md"
        fullWidth
      >
        <EventForm onSubmit={handleFormClose} />
      </Dialog>
    </Container>
  );
};

export default AppointmentsPage;

import React from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  ButtonGroup,
} from "@mui/material";
import {
  Today as TodayIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useEvents } from "../../hooks/useEvents";
import { useCalendar } from "../../hooks/useCalendar";
import CalendarView from "./CalendarView";
import DayAppointments from "./DayAppointments";
import "./CalendarPage.css";

/**
 * CalendarPage - Main calendar page component
 * Displays a large calendar view with a sidebar showing daily appointments
 * @returns {JSX.Element}
 */
const CalendarPage = () => {
  const { events, loading, error, fetchEvents } = useEvents();

  const {
    selectedDate,
    currentView,
    calendarEvents,
    selectedDateAppointments,
    setCurrentView,
    handleSelectSlot,
    handleSelectEvent,
    navigateToToday,
  } = useCalendar(events);

  const handleRefresh = () => {
    fetchEvents();
  };

  const handleNavigate = () => {
    // This is called when user navigates between months/weeks/days
    // We don't need to update selectedDate here, only when explicitly clicking
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{ mt: 4, mb: 4, px: 3, maxWidth: "98vw" }}
      className="calendar-page"
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Calendar
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ButtonGroup variant="outlined" size="medium">
            <Button startIcon={<TodayIcon />} onClick={navigateToToday}>
              Today
            </Button>
            <Button startIcon={<RefreshIcon />} onClick={handleRefresh}>
              Refresh
            </Button>
          </ButtonGroup>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              // Navigate to appointments page to add new appointment
              window.location.href = "/appointments";
            }}
          >
            New Appointment
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Main Calendar Grid */}
      <Box className="calendar-container">
        {/* Calendar View */}
        <Box className="calendar-main">
          <CalendarView
            events={calendarEvents}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            date={selectedDate}
            onNavigate={handleNavigate}
            view={currentView}
            onView={handleViewChange}
          />
        </Box>

        {/* Daily Appointments Sidebar */}
        <Box className="calendar-sidebar">
          <DayAppointments
            selectedDate={selectedDate}
            appointments={selectedDateAppointments}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CalendarPage;

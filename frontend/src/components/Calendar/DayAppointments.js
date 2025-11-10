import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { formatTime } from "../../utils/dateUtils";
import { APPOINTMENT_STATUS } from "../../constants/appointmentStatus";
import AppointmentDetailModal from "./AppointmentDetailModal";

/**
 * Get status color based on appointment status
 * @param {string} status - Appointment status
 * @returns {string} MUI color prop
 */
const getStatusColor = (status) => {
  const statusColors = {
    [APPOINTMENT_STATUS.SCHEDULED]: "primary",
    [APPOINTMENT_STATUS.CONFIRMED]: "info",
    [APPOINTMENT_STATUS.COMPLETED]: "success",
    [APPOINTMENT_STATUS.CANCELLED]: "error",
    [APPOINTMENT_STATUS.NO_SHOW]: "warning",
  };

  return statusColors[status] || "default";
};

/**
 * DayAppointments - Displays all appointments for a selected date
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - The currently selected date
 * @param {Array} props.appointments - Array of appointments for the selected date
 * @returns {JSX.Element}
 */
const DayAppointments = ({ selectedDate, appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "";

    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <EventIcon />
            <Typography variant="h6" component="h2">
              Daily Schedule
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {formatSelectedDate()}
          </Typography>
        </Box>

        {/* Appointments List */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {appointments.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="info" sx={{ borderRadius: "var(--radius-md)" }}>
                No appointments scheduled for this day.
              </Alert>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {appointments.map((appointment, index) => (
                <React.Fragment key={appointment.id}>
                  {index > 0 && <Divider />}
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleAppointmentClick(appointment)}
                      sx={{
                        py: 2,
                        px: 2.5,
                        "&:hover": {
                          backgroundColor: "var(--surface-hover)",
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "start",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, flex: 1 }}
                            >
                              {appointment.title}
                            </Typography>
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            {/* Time */}
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1, fontWeight: 500 }}
                            >
                              {formatTime(appointment.startDate)} -{" "}
                              {formatTime(appointment.endDate)}
                            </Typography>

                            {/* Client */}
                            {appointment.client && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  mb: 0.5,
                                }}
                              >
                                <PersonIcon
                                  sx={{
                                    fontSize: "1rem",
                                    color: "action.active",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {appointment.client.first_name}{" "}
                                  {appointment.client.last_name}
                                </Typography>
                              </Box>
                            )}

                            {/* Property */}
                            {appointment.property && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <HomeIcon
                                  sx={{
                                    fontSize: "1rem",
                                    color: "action.active",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {appointment.property.title}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer with appointment count */}
        {appointments.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid var(--border-primary)",
              backgroundColor: "var(--surface-secondary)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {appointments.length} appointment
              {appointments.length !== 1 ? "s" : ""} scheduled
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

DayAppointments.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  appointments: PropTypes.array.isRequired,
};

export default DayAppointments;

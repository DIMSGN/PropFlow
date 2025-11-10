import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import {
  Event as EventIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { formatDateRange } from "../../utils/dateUtils";
import { APPOINTMENT_STATUS } from "../../constants/appointmentStatus";

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
 * AppointmentDetailModal - Modal component to display full appointment details
 * @param {Object} props - Component props
 * @param {Object|null} props.appointment - Appointment object to display
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @returns {JSX.Element}
 */
const AppointmentDetailModal = ({ appointment, open, onClose }) => {
  if (!appointment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-lg)",
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventIcon color="primary" />
          <Typography variant="h6" component="span">
            Appointment Details
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Title and Status */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                mb: 2,
              }}
            >
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                {appointment.title}
              </Typography>
              <Chip
                label={appointment.status}
                color={getStatusColor(appointment.status)}
                size="medium"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Grid>

          {/* Date and Time */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TimeIcon color="action" />
              <Typography variant="body1" color="text.secondary">
                {formatDateRange(appointment.startDate, appointment.endDate)}
              </Typography>
            </Box>
            <Divider />
          </Grid>

          {/* Description */}
          {appointment.description && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <DescriptionIcon color="action" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {appointment.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Client Information */}
          {appointment.client && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <PersonIcon color="action" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Client
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {appointment.client.first_name}{" "}
                    {appointment.client.last_name}
                  </Typography>
                  {appointment.client.email && (
                    <Typography variant="body2" color="text.secondary">
                      {appointment.client.email}
                    </Typography>
                  )}
                  {appointment.client.phone && (
                    <Typography variant="body2" color="text.secondary">
                      {appointment.client.phone}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Assigned Agent */}
          {appointment.assignedAgent && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <AssignmentIcon color="action" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Assigned Agent
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {appointment.assignedAgent.full_name}
                  </Typography>
                  {appointment.assignedAgent.email && (
                    <Typography variant="body2" color="text.secondary">
                      {appointment.assignedAgent.email}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Property Information */}
          {appointment.property && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <HomeIcon color="action" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Property
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {appointment.property.title}
                  </Typography>
                  {appointment.property.address && (
                    <Typography variant="body2" color="text.secondary">
                      {appointment.property.address}
                    </Typography>
                  )}
                  {appointment.property.price && (
                    <Typography variant="body2" color="text.secondary">
                      ${appointment.property.price.toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Notes */}
          {appointment.notes && (
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Notes
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {appointment.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AppointmentDetailModal.propTypes = {
  appointment: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AppointmentDetailModal;

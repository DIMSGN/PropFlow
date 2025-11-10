import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Paper, Box } from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { APPOINTMENT_STATUS } from "../../constants/appointmentStatus";

// Configure moment as the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

/**
 * Get status color for event styling
 * @param {string} status - Appointment status
 * @returns {string} Color hex code
 */
const getEventColor = (status) => {
  const statusColors = {
    [APPOINTMENT_STATUS.SCHEDULED]: "#667eea",
    [APPOINTMENT_STATUS.CONFIRMED]: "#0288d1",
    [APPOINTMENT_STATUS.COMPLETED]: "#48bb78",
    [APPOINTMENT_STATUS.CANCELLED]: "#f56565",
    [APPOINTMENT_STATUS.NO_SHOW]: "#ed8936",
  };

  return statusColors[status] || "#667eea";
};

/**
 * Custom event component for calendar
 * @param {Object} props - Event props
 * @returns {JSX.Element}
 */
const EventComponent = ({ event }) => {
  const appointment = event.resource;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{event.title}</Box>
      {appointment.client && (
        <Box sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
          {appointment.client.first_name} {appointment.client.last_name}
        </Box>
      )}
    </Box>
  );
};

/**
 * CalendarView - Main calendar component using react-big-calendar
 * @param {Object} props - Component props
 * @param {Array} props.events - Array of calendar events
 * @param {Function} props.onSelectSlot - Callback when a date slot is selected
 * @param {Function} props.onSelectEvent - Callback when an event is selected
 * @param {Date} props.date - Currently selected/viewed date
 * @param {Function} props.onNavigate - Callback when calendar navigation occurs
 * @param {string} props.view - Current calendar view (month, week, day, agenda)
 * @param {Function} props.onView - Callback when view changes
 * @returns {JSX.Element}
 */
const CalendarView = ({
  events,
  onSelectSlot,
  onSelectEvent,
  date,
  onNavigate,
  view,
  onView,
}) => {
  // Custom event style getter
  const eventStyleGetter = (event) => {
    const appointment = event.resource;
    const backgroundColor = getEventColor(appointment.status);

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        padding: "4px 8px",
        fontSize: "0.875rem",
        fontWeight: 500,
      },
    };
  };

  // Custom components for calendar
  const components = useMemo(
    () => ({
      event: EventComponent,
    }),
    []
  );

  return (
    <Paper
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        "& .rbc-calendar": {
          height: "100%",
        },
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", minHeight: "600px" }}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        selectable
        popup
        eventPropGetter={eventStyleGetter}
        components={components}
        date={date}
        onNavigate={onNavigate}
        view={view}
        onView={onView}
        views={["month", "week", "day", "agenda"]}
        tooltipAccessor={(event) => {
          const apt = event.resource;
          return `${event.title}${apt.client ? ` - ${apt.client.first_name} ${apt.client.last_name}` : ""}`;
        }}
        showMultiDayTimes
        step={30}
        timeslots={2}
        messages={{
          next: "Next",
          previous: "Previous",
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          agenda: "Agenda",
          date: "Date",
          time: "Time",
          event: "Appointment",
          noEventsInRange: "No appointments in this range.",
          showMore: (total) => `+${total} more`,
        }}
      />
    </Paper>
  );
};

CalendarView.propTypes = {
  events: PropTypes.array.isRequired,
  onSelectSlot: PropTypes.func.isRequired,
  onSelectEvent: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  onNavigate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  onView: PropTypes.func.isRequired,
};

EventComponent.propTypes = {
  event: PropTypes.object.isRequired,
};

export default CalendarView;

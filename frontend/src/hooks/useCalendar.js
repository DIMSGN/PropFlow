import { useState, useMemo } from "react";
import {
  getAppointmentsForDate,
  appointmentToCalendarEvent,
} from "../utils/dateUtils";

/**
 * Custom hook for managing calendar state and operations
 * @param {Array} appointments - Array of appointments from the API
 * @returns {Object} Calendar state and handlers
 */
export const useCalendar = (appointments) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  // Convert appointments to calendar events format
  const calendarEvents = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) return [];

    return appointments.map(appointmentToCalendarEvent);
  }, [appointments]);

  // Get appointments for the selected date
  const selectedDateAppointments = useMemo(() => {
    if (!selectedDate || !appointments) return [];

    return getAppointmentsForDate(appointments, selectedDate);
  }, [appointments, selectedDate]);

  // Handle date selection from calendar
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
  };

  // Handle event selection from calendar
  const handleSelectEvent = (event) => {
    setSelectedDate(event.start);
  };

  // Navigate to specific date
  const navigateToDate = (date) => {
    setSelectedDate(date);
  };

  // Navigate to today
  const navigateToToday = () => {
    setSelectedDate(new Date());
  };

  return {
    selectedDate,
    currentView,
    calendarEvents,
    selectedDateAppointments,
    setSelectedDate,
    setCurrentView,
    handleSelectSlot,
    handleSelectEvent,
    navigateToDate,
    navigateToToday,
  };
};

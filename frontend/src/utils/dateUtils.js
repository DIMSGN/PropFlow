/**
 * Format a date to a readable string
 * @param {Date|string} date - Date object or ISO string
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return "-";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "-";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return dateObj.toLocaleDateString("en-US", options);
};

/**
 * Format a date for datetime-local input
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date string for input (YYYY-MM-DDTHH:mm)
 */
export const formatDateForInput = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toISOString().slice(0, 16);
};

/**
 * Format time only
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  if (!date) return "-";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "-";

  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Convert appointment data to calendar event format
 * @param {Object} appointment - Appointment object from API
 * @returns {Object} Calendar event object
 */
export const appointmentToCalendarEvent = (appointment) => {
  return {
    id: appointment.id,
    title: appointment.title,
    start: new Date(appointment.startDate),
    end: new Date(appointment.endDate),
    resource: appointment,
  };
};

/**
 * Get all appointments for a specific date
 * @param {Array} appointments - Array of appointments
 * @param {Date} date - The date to filter by
 * @returns {Array} Filtered appointments for the date
 */
export const getAppointmentsForDate = (appointments, date) => {
  if (!date || !appointments) return [];

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return appointments.filter((appointment) => {
    const startDate = new Date(appointment.startDate);
    startDate.setHours(0, 0, 0, 0);

    return startDate.getTime() === targetDate.getTime();
  });
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Format date range for display
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return "-";

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return `${formatDate(start)} ${formatTime(start)} - ${formatTime(end)}`;
  }

  return `${formatDate(start, true)} - ${formatDate(end, true)}`;
};

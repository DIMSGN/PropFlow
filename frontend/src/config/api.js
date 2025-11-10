const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Validate API URL in production
if (process.env.NODE_ENV === "production" && !process.env.REACT_APP_API_URL) {
  console.error(
    "CRITICAL: REACT_APP_API_URL is not set in production environment. " +
      "Please set this environment variable to your backend API URL."
  );
}

export const API_ENDPOINTS = {
  // Appointments (Events)
  APPOINTMENTS: `${API_BASE_URL}/api/appointments`,
  APPOINTMENT_BY_ID: (id) => `${API_BASE_URL}/api/appointments/${id}`,
  UPLOAD_DOCUMENT: (id) => `${API_BASE_URL}/api/appointments/${id}/documents`,
  GET_DOCUMENTS: (id) => `${API_BASE_URL}/api/appointments/${id}/documents`,
  DELETE_DOCUMENT: (id, documentName) =>
    `${API_BASE_URL}/api/appointments/${id}/documents/${documentName}`,

  // Clients
  CLIENTS: `${API_BASE_URL}/api/clients`,
  CLIENT_BY_ID: (id) => `${API_BASE_URL}/api/clients/${id}`,
  CLIENT_STATS: `${API_BASE_URL}/api/clients/stats`,

  // Properties
  PROPERTIES: `${API_BASE_URL}/api/properties`,
  PROPERTY_BY_ID: (id) => `${API_BASE_URL}/api/properties/${id}`,
  PROPERTY_STATS: `${API_BASE_URL}/api/properties/stats`,

  // Users
  USERS: `${API_BASE_URL}/api/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
  USER_LOGIN: `${API_BASE_URL}/api/users/login`,
};

export default API_BASE_URL;

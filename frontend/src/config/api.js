/**
 * ============================================================================
 * FRONTEND API CONFIGURATION - Το "Βιβλίο με τις Διευθύνσεις"
 * FRONTEND API CONFIGURATION - The "Address Book"
 * ============================================================================
 * 
 * 📕 ΤΙ ΕΙΝΑΙ: Κεντρικό σημείο όπου ορίζουμε ΟλΕΣ τις διευθύνσεις του backend
 * 📕 WHAT IS: Central place where we define ALL backend addresses
 * 
 * 🎯 ΓΙΑΤΙ ΧΡΕΙΑΖΕΤΑΙ:
 *    Αντί να γράφουμε σε ΚΑΘΕ component: "https://propflow-8k3o.onrender.com/api/clients"
 *    Το γράφουμε ΜΙΑ ΦΟΡΑ εδώ → Όλα τα components το χρησιμοποιούν!
 * 
 *    ΠΛΕΟΝΕΚΤΗΜΑ: Αν αλλάξει το backend URL, αλλάζουμε ΜΟΝΟ εδώ (1 γραμμή)
 *                 αντί να ψάχνουμε σε 50 αρχεία!
 * 
 * 🔄 ΠΩΣ ΔΟΥΛΕΥΕΙ:
 *    1. Διαβάζει το environment variable: REACT_APP_API_URL
 *    2. Αν ΔΕΝ υπάρχει (π.χ. local development) → χρησιμοποιεί "http://localhost:3001"
 *    3. Φτιάχνει strings με τις πλήρεις διευθύνσεις
 * 
 * 📍 ENVIRONMENT VARIABLES:
 *    - Local: REACT_APP_API_URL δεν υπάρχει → fallback to localhost:3001
 *    - Vercel Production: REACT_APP_API_URL = "https://propflow-8k3o.onrender.com"
 * 
 * @constant {string} API_BASE_URL - Η βασική διεύθυνση του backend
 * @example
 *    Local: "http://localhost:3001"
 *    Production: "https://propflow-8k3o.onrender.com"
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Validation: Ελέγχει αν ξεχάσαμε να ορίσουμε το API URL σε production
 * Validation: Checks if we forgot to set API URL in production
 * 
 * ⚠️ ΚΡΙΤΙΚΟ: Αν είμαστε σε production ΚΑΙ δεν έχουμε REACT_APP_API_URL,
 *    το frontend θα προσπαθήσει να στείλει requests στο localhost → ΛΑΘΟΣ!
 */
if (process.env.NODE_ENV === "production" && !process.env.REACT_APP_API_URL) {
  console.error(
    "CRITICAL: REACT_APP_API_URL is not set in production environment. " +
      "Please set this environment variable to your backend API URL."
  );
}

/**
 * ============================================================================
 * API ENDPOINTS MAPPING - Όλες οι Διευθύνσεις σε Ένα Μέρος
 * API ENDPOINTS MAPPING - All Addresses in One Place
 * ============================================================================
 * 
 * 🗺️ ΤΙ ΕΙΝΑΙ: Object που περιέχει όλες τις διευθύνσεις του API
 * 🗺️ WHAT IS: Object containing all API addresses
 * 
 * 📝 ΔΟΜΗ:
 *    - Strings: Για endpoints χωρίς παραμέτρους (πχ. /api/clients)
 *    - Functions: Για endpoints με παραμέτρους (πχ. /api/clients/5)
 * 
 * 💡 ΠΩΣ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ:
 * 
 *    ΣΤΟ COMPONENT:
 *    import { API_ENDPOINTS } from '../../config/api';
 *    
 *    // Παράδειγμα 1: GET όλους τους clients
 *    axios.get(API_ENDPOINTS.CLIENTS)
 *    // Στέλνει → GET https://propflow-8k3o.onrender.com/api/clients
 *    
 *    // Παράδειγμα 2: GET έναν client με ID=5
 *    axios.get(API_ENDPOINTS.CLIENT_BY_ID(5))
 *    // Στέλνει → GET https://propflow-8k3o.onrender.com/api/clients/5
 *    
 *    // Παράδειγμα 3: CREATE νέο client
 *    axios.post(API_ENDPOINTS.CLIENTS, { first_name: "Maria", ... })
 *    // Στέλνει → POST https://propflow-8k3o.onrender.com/api/clients
 *    //           με body: { first_name: "Maria", ... }
 * 
 * @typedef {Object} ApiEndpoints
 * @property {string} APPOINTMENTS - Base endpoint για appointments
 * @property {Function} APPOINTMENT_BY_ID - Function που παίρνει ID και επιστρέφει URL
 * @property {string} CLIENTS - Base endpoint για clients
 * @property {Function} CLIENT_BY_ID - Function για specific client
 * @property {string} CLIENT_STATS - Endpoint για client statistics
 * @property {string} PROPERTIES - Base endpoint για properties
 * @property {Function} PROPERTY_BY_ID - Function για specific property
 * @property {string} USERS - Base endpoint για users
 * @property {string} USER_LOGIN - Endpoint για login
 */
export const API_ENDPOINTS = {
  // ========== APPOINTMENTS (Ραντεβού) ==========
  /**
   * @description GET όλα τα appointments, POST νέο appointment
   * @example axios.get(API_ENDPOINTS.APPOINTMENTS)
   */
  APPOINTMENTS: `${API_BASE_URL}/api/appointments`,
  
  /**
   * @description GET/PUT/DELETE συγκεκριμένο appointment
   * @param {number} id - Το ID του appointment
   * @returns {string} Full URL για το appointment
   * @example axios.get(API_ENDPOINTS.APPOINTMENT_BY_ID(5))
   */
  APPOINTMENT_BY_ID: (id) => `${API_BASE_URL}/api/appointments/${id}`,
  
  /**
   * @description POST upload document για appointment
   * @param {number} id - Το ID του appointment
   */
  UPLOAD_DOCUMENT: (id) => `${API_BASE_URL}/api/appointments/${id}/documents`,
  
  /**
   * @description GET όλα τα documents ενός appointment
   * @param {number} id - Το ID του appointment
   */
  GET_DOCUMENTS: (id) => `${API_BASE_URL}/api/appointments/${id}/documents`,
  
  /**
   * @description DELETE συγκεκριμένο document
   * @param {number} id - Το ID του appointment
   * @param {string} documentName - Το όνομα του file
   */
  DELETE_DOCUMENT: (id, documentName) =>
    `${API_BASE_URL}/api/appointments/${id}/documents/${documentName}`,

  // ========== CLIENTS (Πελάτες) ==========
  /**
   * @description GET όλους τους clients, POST νέο client
   * @example axios.get(API_ENDPOINTS.CLIENTS)
   * @example axios.post(API_ENDPOINTS.CLIENTS, { first_name: "Maria", ... })
   */
  CLIENTS: `${API_BASE_URL}/api/clients`,
  
  /**
   * @description GET/PUT/DELETE συγκεκριμένο client
   * @param {number} id - Το ID του client
   * @returns {string} Full URL για τον client
   * @example axios.put(API_ENDPOINTS.CLIENT_BY_ID(5), { email: "new@email.com" })
   */
  CLIENT_BY_ID: (id) => `${API_BASE_URL}/api/clients/${id}`,
  
  /**
   * @description GET στατιστικά για clients (total, nationalities, κτλ)
   * @example axios.get(API_ENDPOINTS.CLIENT_STATS)
   */
  CLIENT_STATS: `${API_BASE_URL}/api/clients/stats`,

  // ========== PROPERTIES (Ακίνητα) ==========
  /**
   * @description GET όλα τα properties, POST νέο property
   */
  PROPERTIES: `${API_BASE_URL}/api/properties`,
  
  /**
   * @description GET/PUT/DELETE συγκεκριμένο property
   * @param {number} id - Το ID του property
   */
  PROPERTY_BY_ID: (id) => `${API_BASE_URL}/api/properties/${id}`,
  
  /**
   * @description GET στατιστικά για properties
   */
  PROPERTY_STATS: `${API_BASE_URL}/api/properties/stats`,

  // ========== USERS (Χρήστες & Authentication) ==========
  /**
   * @description GET όλους τους users, POST νέο user
   */
  USERS: `${API_BASE_URL}/api/users`,
  
  /**
   * @description GET/PUT/DELETE συγκεκριμένο user
   * @param {number} id - Το ID του user
   */
  USER_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
  
  /**
   * @description POST login credentials για authentication
   * @example axios.post(API_ENDPOINTS.USER_LOGIN, { email, password })
   */
  USER_LOGIN: `${API_BASE_URL}/api/users/login`,
};

export default API_BASE_URL;

/**
 * Middleware Ελέγχου Ταυτοποίησης (Authentication Middleware)
 *
 * ΠΡΟΣΟΧΗ: Αυτή είναι μια ΑΠΛΟΥΣΤΕΥΜΕΝΗ υλοποίηση για demo σκοπούς.
 * Για παραγωγή, ΠΡΕΠΕΙ να χρησιμοποιηθούν JWT tokens ή session-based auth.
 *
 * WARNING: This is a SIMPLIFIED implementation for demo purposes.
 * For production, you MUST use JWT tokens or session-based authentication.
 *
 * @module middleware/auth
 */

const { User } = require("../models");

/**
 * Middleware για έλεγχο ταυτοποίησης χρήστη (User authentication check)
 *
 * Ελέγχει αν υπάρχει έγκυρο user-id στα headers και φορτώνει τον χρήστη.
 * Checks if valid user-id exists in headers and loads the user.
 *
 * TODO: Αντικατάσταση με JWT authentication (Replace with JWT authentication)
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Παίρνουμε το user ID από τα headers (Get user ID from headers)
    const userId = req.headers["user-id"] || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
        message: "No user credentials provided",
      });
    }

    // Επαλήθευση ότι ο χρήστης υπάρχει στη βάση (Verify user exists in database)
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid user credentials",
      });
    }

    // Έλεγχος αν ο λογαριασμός είναι ενεργός (Check if account is active)
    if (!user.is_active) {
      return res.status(403).json({
        error: "Account disabled",
        message: "This account has been deactivated",
      });
    }

    // Αποθήκευση user στο request για χρήση στους controllers (Store user in request for controllers)
    req.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      error: "Authentication error",
      message: "An error occurred during authentication",
    });
  }
};

/**
 * Middleware για έλεγχο ρόλων χρήστη (User role authorization)
 *
 * Επιστρέφει middleware που ελέγχει αν ο χρήστης έχει έναν από τους επιτρεπτούς ρόλους.
 * Returns middleware that checks if user has one of the allowed roles.
 *
 * @param {...string} allowedRoles - Οι επιτρεπτοί ρόλοι (admin, agent, κτλ)
 * @returns {Function} Express middleware
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Έλεγχος αν ο χρήστης έχει ταυτοποιηθεί (Check if user is authenticated)
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        message: "You must be logged in to access this resource",
      });
    }

    // Έλεγχος αν ο ρόλος του χρήστη είναι επιτρεπτός (Check if user role is allowed)
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access denied",
        message: `This resource requires one of the following roles: ${allowedRoles.join(
          ", "
        )}`,
        requiredRoles: allowedRoles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

/**
 * Middleware που απαιτεί Admin ρόλο (Requires Admin role)
 * Χρησιμοποιείται για ευαίσθητες λειτουργίες όπως δημιουργία χρηστών.
 * Used for sensitive operations like user creation.
 */
const requireAdmin = requireRole("admin");

/**
 * Middleware που απαιτεί Agent ή Admin ρόλο (Requires Agent or Admin role)
 * Χρησιμοποιείται για κοινές λειτουργίες της εφαρμογής.
 * Used for common application operations.
 */
const requireAgent = requireRole("admin", "agent");

module.exports = {
  authenticateUser,
  requireRole,
  requireAdmin,
  requireAgent,
};

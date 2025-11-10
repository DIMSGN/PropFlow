import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import SideNav from "./components/SideNav/SideNav";
import Settings from "./components/Settings/Settings";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import ClientList from "./components/Clients/ClientList";
import PropertyList from "./components/Properties/PropertyList";
import UserList from "./components/Users/UserList";
import AppointmentsPage from "./components/Appointments/AppointmentsPage";
import CalendarPage from "./components/Calendar/CalendarPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  // Initialize dark mode from localStorage, default to false if not set
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.body.className = newMode ? "dark-mode" : "light-mode";
  };

  // Apply saved dark mode on component mount
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated && <SideNav />}
      <div className={`app-container ${darkMode ? "dark" : "light"}`}>
        {isAuthenticated && (
          <div className="app-header">
            <div className="app-logo">
              <CalendarTodayIcon className="logo-icon" />
              <div className="logo-text">
                <span className="logo-business">Business</span>
                <span className="logo-cms">CMS</span>
              </div>
            </div>
            <IconButton
              onClick={toggleDarkMode}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="theme-toggle"
              sx={{
                color: darkMode ? "#48bb78" : "#667eea",
                backgroundColor: "var(--surface-elevated)",
                boxShadow: "var(--shadow-sm)",
                "&:hover": {
                  backgroundColor: "var(--surface-hover)",
                  boxShadow: "var(--shadow-md)",
                },
              }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </div>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="main-content-wrapper">
                  <Dashboard />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <div className="main-content-wrapper">
                  <ClientList />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <div className="main-content-wrapper">
                  <PropertyList />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <div className="main-content-wrapper">
                  <UserList />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <div className="main-content-wrapper">
                  <AppointmentsPage />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <div className="main-content-wrapper">
                  <CalendarPage />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div className="main-content-wrapper">
                  <Settings
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>

        {isAuthenticated && (
          <footer className="app-footer">
            © {new Date().getFullYear()} All rights reserved
          </footer>
        )}
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

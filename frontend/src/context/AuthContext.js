import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Set default auth header
        axios.defaults.headers.common["user-id"] = parsedUser.id;
        return parsedUser;
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  // No longer need this useEffect since we're using lazy initialization
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     try {
  //       const parsedUser = JSON.parse(storedUser);
  //       setUser(parsedUser);
  //       axios.defaults.headers.common["user-id"] = parsedUser.id;
  //     } catch (error) {
  //       console.error("Failed to parse stored user:", error);
  //       localStorage.removeItem("user");
  //     }
  //   }
  //   setLoading(false);
  // }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER_LOGIN, {
        email,
        password,
      });

      // Backend returns { message, user }, we need just the user
      const userData = response.data.user || response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set default auth header for future requests
      axios.defaults.headers.common["user-id"] = userData.id;

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);

      // Better error handling
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        // Server responded with error
        errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          errorMessage;
      } else if (error.request) {
        // Request made but no response
        errorMessage =
          "Cannot connect to server. Please ensure the backend is running.";
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["user-id"];
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isAgent = () => {
    return user?.role === "agent";
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isAgent,
    loading: false,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

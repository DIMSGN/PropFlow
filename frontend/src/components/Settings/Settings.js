import React from "react";
import PropTypes from "prop-types";
import "./Settings.css";

const Settings = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <div className="settings-item">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            Dark Mode
          </label>
        </div>
        <p className="settings-description">
          Toggle between light and dark themes for the entire application
        </p>
      </div>
    </div>
  );
};

Settings.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Settings;

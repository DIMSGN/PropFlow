import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import "./SideNav.css";

const SideNav = () => {
  const [visible, setVisible] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const toggleNav = () => {
    setVisible(!visible);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setVisible(false);
  };

  return (
    <>
      <IconButton
        onClick={toggleNav}
        className="menu-icon-button"
        aria-label="Toggle navigation menu"
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={visible} onClose={toggleNav}>
        <div className="side-nav" role="navigation">
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CalendarTodayIcon
                sx={{ fontSize: "2rem", color: "primary.main" }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Business
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "primary.main",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  CMS
                </Typography>
              </Box>
            </Box>
            {user && (
              <Typography variant="caption" color="text.secondary">
                {user.full_name} ({user.role})
              </Typography>
            )}
          </Box>

          <List>
            <ListItem
              component={Link}
              to="/dashboard"
              sx={{ cursor: "pointer" }}
              onClick={toggleNav}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              component={Link}
              to="/clients"
              sx={{ cursor: "pointer" }}
              onClick={toggleNav}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Clients" />
            </ListItem>

            <ListItem
              component={Link}
              to="/properties"
              sx={{ cursor: "pointer" }}
              onClick={toggleNav}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Properties" />
            </ListItem>

            <ListItem
              component={Link}
              to="/appointments"
              sx={{ cursor: "pointer" }}
              onClick={toggleNav}
            >
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Appointments" />
            </ListItem>

            <ListItem
              component={Link}
              to="/calendar"
              sx={{ cursor: "pointer" }}
              onClick={toggleNav}
            >
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItem>

            {isAdmin() && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem
                  component={Link}
                  to="/users"
                  sx={{ cursor: "pointer" }}
                  onClick={toggleNav}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="User Management" />
                </ListItem>
              </>
            )}

            <Divider sx={{ my: 1 }} />

            <ListItem
              component={Link}
              to="/settings"
              sx={{ cursor: "pointer" }}
              onClick={toggleNav}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>

          <Box
            sx={{
              p: 2,
              mt: "auto",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </div>
      </Drawer>
    </>
  );
};

export default SideNav;

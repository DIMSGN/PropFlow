import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  People as PeopleIcon,
  Home as HomeIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { API_ENDPOINTS } from "../../config/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    clients: { total: 0, byNationality: [] },
    properties: { total: 0, byStatus: [] },
    appointments: { total: 0 },
    documents: { total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [clientStats, propertyStats, appointments] = await Promise.all([
        axios.get(API_ENDPOINTS.CLIENT_STATS),
        axios.get(API_ENDPOINTS.PROPERTY_STATS),
        axios.get(API_ENDPOINTS.APPOINTMENTS),
      ]);

      setStats({
        clients: clientStats.data,
        properties: propertyStats.data,
        appointments: { total: appointments.data.length },
        documents: { total: 0 }, // Could add a documents endpoint later
      });
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h3" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    icon: PropTypes.element.isRequired,
    color: PropTypes.string.isRequired,
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value={stats.clients.total}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Properties"
            value={stats.properties.total}
            icon={<HomeIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Appointments"
            value={stats.appointments.total}
            icon={<EventIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Documents"
            value={stats.documents.total}
            icon={<DescriptionIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Properties by Status
            </Typography>
            {stats.properties.byStatus.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {stats.properties.byStatus.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {item.status}
                    </Typography>
                    <Typography color="primary" fontWeight="bold">
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No data available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

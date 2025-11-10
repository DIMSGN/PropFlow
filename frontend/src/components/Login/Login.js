import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
                mb: 1,
              }}
            >
              <CalendarTodayIcon
                sx={{ fontSize: "3rem", color: "primary.main" }}
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
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Business
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
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
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              color="text.secondary"
            >
              Sign In
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoFocus
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>
            </form>

            <Box sx={{ mt: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Demo Accounts:
              </Typography>
              <Typography variant="caption" display="block">
                Admin: admin@goldenvisa.gr / password123
              </Typography>
              <Typography variant="caption" display="block">
                Agent: agent@goldenvisa.gr / password123
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Login;

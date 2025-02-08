/* eslint-disable no-unused-vars */
// Import required dependencies
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { authenticateLogin } from "./authService";

// Define styles for the background and form container
const styles = {
  background: {
    backgroundImage:
      "url('https://img.freepik.com/free-vector/hanging-style-coming-soon-tag-yellow-background-design_1017-54620.jpg?t=st=1735456363~exp=1735459963~hmac=065d99d6b4e9eb54415ec7ebee7e8dfbaea0f771133dc9253385d5bfa2c1b86e&w=1800')", // Replace with your background image URL
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%", // Make it responsive
    maxWidth: 400,
    padding: "24px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white
  },
};

const LoginWebsite = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await authenticateLogin(credentials);
    setLoading(false);
    console.log("result::" + result.message);
    if (result.success) {
      navigate("/"); // Redirect to home page
      window.location.reload();
    } else {
      setError(result.message);
    }
  };

  return (
    <Box style={styles.background}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        style={styles.formContainer}
      >
        <Typography variant="h4" textAlign="center" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={credentials.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={handleChange}
        />
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginWebsite;

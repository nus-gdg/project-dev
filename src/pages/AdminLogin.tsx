import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const theme = useTheme()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin")
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{
        p: 4,
        width: 400,
        maxWidth: "90%",
        borderRadius: 3,
        background: "linear-gradient(135deg, #A6E1FF 0%, #7BA1F5 78%)",
        boxShadow: "0 4px 4px 4px rgba(40, 60, 119, 0.55)", // custom shadow
      }}>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h2" sx={{ mb: 2 }}>Admin Login</Typography>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
              },
              mb: 2
            }}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
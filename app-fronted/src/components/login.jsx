import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      redirigirPorRol(user.rol);
    }
  }, []);

  const redirigirPorRol = (rol) => {
    if (rol === "admin") navigate("/home/admin", { replace: true });
    else if (rol === "tecnico") navigate("/home/tecnico", { replace: true });
    else if (rol === "cliente") navigate("/home/cliente", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3200/repair/login", {
        username,
        password,
      });

      const res = response.data;

      if (res.success && res.data.length > 0) {
        const userData = res.data[0];

        localStorage.setItem("user", JSON.stringify(userData));

        if (userData.rol === "tecnico" || userData.rol === "admin") {
          try {
            const tecnicoRes = await axios.post(
              "http://localhost:3200/repair",
              {
                id_usuario: userData.id,
                rol: "tecnico",
              }
            );

            const tecnicoData = tecnicoRes.data.data;
            const tecnico = Array.isArray(tecnicoData)
              ? tecnicoData[0]
              : tecnicoData;

            if (tecnico?.id) {
              localStorage.setItem("tecnico", JSON.stringify(tecnico));
              console.log("Técnico guardado en localStorage:", tecnico);
            } else {
              console.warn("No se encontró id_tecnico");
            }
          } catch (err) {
            console.error("Error al obtener id_tecnico:", err);
          }
        }

        if (userData.rol === "cliente") {
          try {
            const clienteRes = await axios.post(
              "http://localhost:3200/repair",
              {
                id_usuario: userData.id,
                rol: "cliente",
              }
            );

            const clienteData = clienteRes.data.data;
            const cliente = Array.isArray(clienteData)
              ? clienteData[0]
              : clienteData;

            if (cliente?.id) {
              localStorage.setItem("cliente", JSON.stringify(cliente));
              console.log("Cliente guardado en localStorage:", cliente);
            } else {
              console.warn("No se encontró id_cliente");
            }
          } catch (err) {
            console.error("Error al obtener id_cliente:", err);
          }
        }

        redirigirPorRol(userData.rol);
      } else {
        setError("Credenciales inválidas.");
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message || "ERROR AL CONECTAR CON EL SERVIDOR"
        );
      } else {
        setError("ERROR AL CONECTAR CON EL SERVIDOR: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, mt: 5 }}>
        <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
          LOGIN
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ padding: "10px", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "INGRESAR"}
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          ¿No tienes una cuenta?{" "}
          <Button onClick={() => navigate("/register/cliente")}>
            Registrar
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;

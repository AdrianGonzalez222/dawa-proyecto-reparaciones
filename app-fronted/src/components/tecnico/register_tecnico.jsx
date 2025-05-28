import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import axios from "axios";

const RegisterTecnico = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    cedula: "",
    nombres: "",
    apellidos: "",
    celular: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((field) => field === "")) {
      setMessage("Todos los campos son obligatorios");
      setSuccess(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:3200/repair/usuario/register/tecnico",
        {
          ...form,
          rol: "tecnico",
        }
      );
      setMessage("Técnico registrado correctamente");
      setSuccess(true);
      setForm({
        username: "",
        password: "",
        email: "",
        cedula: "",
        nombres: "",
        apellidos: "",
        celular: "",
      });
    } catch (error) {
      const res = error.response?.data?.message || "Error en el registro";
      setMessage(res);
      setSuccess(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, mt: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Registro de Técnico
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {[
              { name: "username", label: "Nombre de Usuario" },
              { name: "email", label: "Correo Electrónico", type: "email" },
              { name: "password", label: "Contraseña", type: "password" },
              { name: "cedula", label: "Cédula" },
              { name: "nombres", label: "Nombres" },
              { name: "apellidos", label: "Apellidos" },
              { name: "celular", label: "Celular" },
            ].map(({ name, label, type = "text" }) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  fullWidth
                  label={label}
                  name={name}
                  type={type}
                  variant="outlined"
                  value={form[name]}
                  onChange={handleChange}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Registrar
          </Button>
          {message && (
            <Alert severity={success ? "success" : "error"} sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterTecnico;

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

const RegistrarRepuesto = () => {
  const [form, setForm] = useState({
    codigo: "",
    descripcion: "",
    stock: "",
    precio: "",
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
      await axios.post("http://localhost:3200/repair/repuesto", form);
      setMessage("Repuesto registrado correctamente");
      setSuccess(true);
      setForm({
        codigo: "",
        descripcion: "",
        stock: "",
        precio: "",
      });
    } catch (error) {
      const res =
        error.response?.data?.message || "Error al registrar repuesto";
      setMessage(res);
      setSuccess(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, mt: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Registro de Repuesto
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio"
                name="precio"
                type="number"
                inputProps={{ step: "0.01" }}
                value={form.precio}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
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

export default RegistrarRepuesto;

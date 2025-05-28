import React, { useState, useEffect } from "react";
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

const RegisterFactura = () => {
  const [form, setForm] = useState({
    num_fact: "",
    iva_app: "15", // IVA fijo en Ecuador
    iva: "",
    subtotal: "",
    total: "",
    id_reparacion: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Calcular IVA ($) y Total automáticamente
  useEffect(() => {
    const subtotalValue = parseFloat(form.subtotal);
    if (!isNaN(subtotalValue)) {
      const ivaValue = parseFloat((subtotalValue * 0.15).toFixed(2));
      const totalValue = parseFloat((subtotalValue + ivaValue).toFixed(2));
      setForm((prevForm) => ({
        ...prevForm,
        iva: ivaValue.toString(),
        total: totalValue.toString(),
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        iva: "",
        total: "",
      }));
    }
  }, [form.subtotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.num_fact ||
      !form.subtotal ||
      !form.id_reparacion ||
      form.iva === "" ||
      form.total === ""
    ) {
      setMessage("Todos los campos son obligatorios");
      setSuccess(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3200/repair/factura",
        form
      );
      setMessage(response.data.message || "Factura registrada correctamente");
      setSuccess(true);
      setForm({
        num_fact: "",
        iva_app: "15",
        iva: "",
        subtotal: "",
        total: "",
        id_reparacion: "",
      });
    } catch (error) {
      const res =
        error.response?.data?.message || "Error al registrar la factura";
      setMessage(res);
      setSuccess(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, mt: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Registrar Factura
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {[
              { name: "num_fact", label: "Número de Factura" },
              { name: "subtotal", label: "Subtotal ($)", type: "number" },
              { name: "id_reparacion", label: "ID Reparación" },
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IVA Aplicado (%)"
                name="iva_app"
                variant="outlined"
                value="15"
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IVA ($)"
                name="iva"
                variant="outlined"
                value={form.iva}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total ($)"
                name="total"
                variant="outlined"
                value={form.total}
                disabled
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

export default RegisterFactura;

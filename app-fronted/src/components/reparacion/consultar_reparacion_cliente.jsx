import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

const ConsultarReparacionCliente = () => {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cliente = JSON.parse(localStorage.getItem("cliente"));
    const id_cliente = cliente?.id;

    if (!id_cliente) {
      setError("No se encontró el ID del cliente.");
      setLoading(false);
      return;
    }

    const fetchHistorial = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3200/repair/reparacion/history",
          { id_cliente }
        );

        setReparaciones(response.data.data || []);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message || "Error al obtener historial.");
        } else {
          setError("Error de conexión con el servidor.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <Container sx={{ mt: 4, paddingBottom: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Historial de Reparaciones
      </Typography>

      {loading && (
        <Paper sx={{ padding: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 3, width: "100%", maxWidth: 1200 }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Equipo
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Estado del Equipo
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Fecha Creación
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Técnico Asignado
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Problema
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reparaciones.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ fontStyle: "italic" }}
                    >
                      No hay reparaciones registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  reparaciones.map((rep) => (
                    <TableRow key={rep.id} hover>
                      <TableCell sx={{ fontSize: "0.9rem" }}>
                        {rep.equipo}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.9rem" }}>
                        {rep.estado_order}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.9rem" }}>
                        {rep.estado_equipo || "Sin estado"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.9rem" }}>
                        {rep.fecha_creacion}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.9rem" }}>
                        {rep.tecnico_asignado || "No asignado"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.9rem" }}>
                        {rep.problema}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default ConsultarReparacionCliente;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ConsultarFactura = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  useEffect(() => {
    obtenerFacturas();
  }, []);

  const obtenerFacturas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3200/repair/factura/reporter"
      );
      setFacturas(response.data.data);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirDialog = (factura) => {
    setFacturaSeleccionada(factura);
    setMensajeConfirmacion("");
    setOpenDialog(true);
  };

  const handleCancelar = () => {
    setOpenDialog(false);
    setFacturaSeleccionada(null);
  };

  const handleConfirmarAnulacion = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3200/repair/factura/reporter",
        {
          id: facturaSeleccionada.id,
        }
      );

      setMensajeConfirmacion(response.data.message);

      setTimeout(() => {
        setOpenDialog(false);
        setFacturaSeleccionada(null);
        obtenerFacturas();
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Error al anular la factura";
      setMensajeConfirmacion(msg);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Facturas
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "#fff" }}>#</TableCell>
                <TableCell sx={{ color: "#fff" }}>N° Factura</TableCell>
                <TableCell sx={{ color: "#fff" }}>Cliente</TableCell>
                <TableCell sx={{ color: "#fff" }}>Cédula Cliente</TableCell>
                <TableCell sx={{ color: "#fff" }}>Técnico</TableCell>
                <TableCell sx={{ color: "#fff" }}>Fecha</TableCell>
                <TableCell sx={{ color: "#fff" }}>Total</TableCell>
                <TableCell sx={{ color: "#fff" }}>Estado</TableCell>
                <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturas.map((factura, index) => (
                <TableRow key={factura.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{factura.num_fact}</TableCell>
                  <TableCell>{factura.cliente}</TableCell>
                  <TableCell>{factura.cedula_cliente}</TableCell>
                  <TableCell>{factura.tecnico}</TableCell>
                  <TableCell>{factura.fecha}</TableCell>
                  <TableCell>
                    {isNaN(factura.total)
                      ? "N/A"
                      : `$${Number(factura.total).toFixed(2)}`}
                  </TableCell>
                  <TableCell>{factura.estado}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleAbrirDialog(factura)}
                      disabled={factura.estado === "anulada"}
                    >
                      Anular Factura
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {facturas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No hay facturas disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCancelar}>
        <DialogTitle>Confirmar Anulación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas anular la factura{" "}
            <strong>{facturaSeleccionada?.num_fact}</strong>?
          </Typography>
          {mensajeConfirmacion && (
            <Box
              mt={2}
              p={1}
              bgcolor="#e0f2f1"
              color="#00695c"
              borderRadius={1}
            >
              {mensajeConfirmacion}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelar} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarAnulacion}
            color="error"
            variant="contained"
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultarFactura;

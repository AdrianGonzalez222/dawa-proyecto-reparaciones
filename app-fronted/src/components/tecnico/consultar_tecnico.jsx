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
  Button,
  Modal,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ConsultarReparacionAsignada = () => {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState(null);

  useEffect(() => {
    obtenerReparaciones();
  }, []);

  useEffect(() => {
    if (mensaje.texto) {
      const timer = setTimeout(() => {
        setMensaje({ tipo: "", texto: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const obtenerReparaciones = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3200/repair/reparacion/list"
      );
      const asignadas = response.data.data.filter(
        (r) => r.estado === "asignada"
      );
      setReparaciones(asignadas);
    } catch (error) {
      console.error("Error al obtener reparaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (reparacion) => {
    setReparacionSeleccionada({ ...reparacion });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setReparacionSeleccionada(null);
  };

  const handleGuardarCambios = async () => {
    try {
      const payload = {
        id: reparacionSeleccionada.id,
      };

      await axios.put("http://localhost:3200/repair/reparacion", payload);

      setMensaje({
        tipo: "success",
        texto: "Reparación actualizada correctamente.",
      });

      setTimeout(() => {
        handleCloseModal();
        obtenerReparaciones();
      }, 2000);
    } catch (error) {
      let msg = "Error al actualizar la reparación.";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setMensaje({ tipo: "error", texto: msg });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reparaciones Asignadas
      </Typography>

      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>#</TableCell>
                <TableCell sx={{ color: "#fff" }}>Cliente</TableCell>
                <TableCell sx={{ color: "#fff" }}>Equipo</TableCell>
                <TableCell sx={{ color: "#fff" }}>Descripción</TableCell>
                <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reparaciones.map((rep, index) => (
                <TableRow key={rep.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{rep.cliente}</TableCell>
                  <TableCell>{rep.equipo}</TableCell>
                  <TableCell>{rep.descripcion}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenModal(rep)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reparaciones.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay reparaciones asignadas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={styleModal}>
          <Typography variant="h6" gutterBottom>
            Editar Reparación
          </Typography>

          {mensaje.texto && (
            <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
              {mensaje.texto}
            </Alert>
          )}

          {reparacionSeleccionada && (
            <>
              <TextField
                label="Cliente"
                value={reparacionSeleccionada.cliente}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Descripción"
                value={reparacionSeleccionada.descripcion}
                fullWidth
                margin="normal"
                onChange={(e) =>
                  setReparacionSeleccionada((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
              />
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" onClick={handleGuardarCambios}>
                  Guardar
                </Button>
                <Button sx={{ ml: 2 }} onClick={handleCloseModal}>
                  Cancelar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ConsultarReparacionAsignada;

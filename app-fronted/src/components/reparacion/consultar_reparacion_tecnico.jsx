import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const ConsultarReparacionTecnico = () => {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState(null);
  const [idTecnico, setIdTecnico] = useState("");
  const [mensajeAsignacion, setMensajeAsignacion] = useState("");

  useEffect(() => {
    obtenerReparaciones();
  }, []);

  const obtenerReparaciones = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3200/repair/reparacion/list/available"
      );
      setReparaciones(response.data.data);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "No se pudieron cargar las reparaciones.";
      setMensaje(msg);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (reparacion) => {
    setReparacionSeleccionada(reparacion);
    setModalOpen(true);
    setMensajeAsignacion("");
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setReparacionSeleccionada(null);
    setIdTecnico("");
  };

  const asignarTecnico = async () => {
    if (!idTecnico || !reparacionSeleccionada) return;

    try {
      const body = {
        id_reparacion: reparacionSeleccionada.id,
        id_tecnico: idTecnico,
      };

      const response = await axios.post(
        "http://localhost:3200/repair/reparacion/list/available",
        body
      );

      setMensajeAsignacion(response.data.message);
      obtenerReparaciones();
    } catch (error) {
      const msg =
        error.response?.data?.message || "No se pudo asignar la reparación.";
      setMensajeAsignacion(msg);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reparaciones Pendientes
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : mensaje ? (
        <Alert severity="warning">{mensaje}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "#fff" }}>#</TableCell>
                <TableCell sx={{ color: "#fff" }}>Cliente</TableCell>
                <TableCell sx={{ color: "#fff" }}>Cédula</TableCell>
                <TableCell sx={{ color: "#fff" }}>Celular</TableCell>
                <TableCell sx={{ color: "#fff" }}>Equipo</TableCell>
                <TableCell sx={{ color: "#fff" }}>Problema</TableCell>
                <TableCell sx={{ color: "#fff" }}>Fecha</TableCell>
                <TableCell sx={{ color: "#fff" }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reparaciones.map((reparacion, index) => (
                <TableRow key={reparacion.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{reparacion.nombre_cliente}</TableCell>
                  <TableCell>{reparacion.cedula}</TableCell>
                  <TableCell>{reparacion.celular}</TableCell>
                  <TableCell>{reparacion.equipo}</TableCell>
                  <TableCell>{reparacion.problema}</TableCell>
                  <TableCell>{reparacion.fecha_creacion}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => abrirModal(reparacion)}
                    >
                      Asignar Técnico
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reparaciones.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No hay reparaciones pendientes registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MODAL DE ASIGNACIÓN */}
      <Dialog open={modalOpen} onClose={cerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Técnico</DialogTitle>
        <DialogContent>
          {reparacionSeleccionada && (
            <>
              <TextField
                label="Cliente"
                value={reparacionSeleccionada.nombre_cliente}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Cédula"
                value={reparacionSeleccionada.cedula}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Equipo"
                value={reparacionSeleccionada.equipo}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Problema"
                value={reparacionSeleccionada.problema}
                fullWidth
                margin="normal"
                multiline
                disabled
              />
              <TextField
                label="Técnico a asignar (ID)"
                value={idTecnico}
                onChange={(e) => setIdTecnico(e.target.value)}
                fullWidth
                margin="normal"
                type="number"
              />

              {mensajeAsignacion && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {mensajeAsignacion}
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={asignarTecnico}
            disabled={!idTecnico}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultarReparacionTecnico;

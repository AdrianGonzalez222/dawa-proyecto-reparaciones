import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

const estados = ["recibido", "reparando", "reparado", "pausado"];

const ConsultarReparacionAsignada = () => {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState(null);

  useEffect(() => {
    obtenerReparacionesAsignadas();
  }, []);

  const obtenerReparacionesAsignadas = async () => {
    setLoading(true);
    try {
      const tecnico = JSON.parse(localStorage.getItem("tecnico"));
      const id_tecnico = tecnico?.id;

      if (!id_tecnico) {
        console.error("ID del técnico no encontrado");
        setReparaciones([]);
        return;
      }

      const response = await axios.post(
        "http://localhost:3200/repair/reparacion/list/task",
        {
          id_tecnico,
        }
      );

      setReparaciones(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener reparaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (reparacion) => {
    setReparacionSeleccionada({
      ...reparacion,
      id_reparacion: reparacion.id_reparacion || reparacion.id,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setReparacionSeleccionada(null);
  };

  const guardarCambios = async () => {
    try {
      const { id_reparacion, id, estado, observacion, precio_servicio } =
        reparacionSeleccionada;

      const reparacionId = id_reparacion || id;

      const datosEnviar = {
        id_reparacion: reparacionId,
        estado: estado || "",
        observacion: observacion || "",
        precio_servicio:
          parseFloat(parseFloat(precio_servicio).toFixed(2)) || 0.0,
      };

      console.log("Enviando:", datosEnviar);

      await axios.put(
        "http://localhost:3200/repair/reparacion/list/task",
        datosEnviar
      );

      cerrarModal();
      obtenerReparacionesAsignadas();
    } catch (error) {
      console.error(
        "Error al actualizar reparación:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reparaciones Asignadas
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
                <TableCell sx={{ color: "#fff" }}>Equipo</TableCell>
                <TableCell sx={{ color: "#fff" }}>Problema</TableCell>
                <TableCell sx={{ color: "#fff" }}>Cliente</TableCell>
                <TableCell sx={{ color: "#fff" }}>Cédula</TableCell>
                <TableCell sx={{ color: "#fff" }}>Celular</TableCell>
                <TableCell sx={{ color: "#fff" }}>Dirección</TableCell>
                <TableCell sx={{ color: "#fff" }}>Asignación</TableCell>
                <TableCell sx={{ color: "#fff" }}>Fin</TableCell>
                <TableCell sx={{ color: "#fff" }}>Estado</TableCell>
                <TableCell sx={{ color: "#fff" }}>Observación</TableCell>
                <TableCell sx={{ color: "#fff" }}>Precio</TableCell>
                <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reparaciones.map((rep, index) => (
                <TableRow key={rep.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{rep.equipo}</TableCell>
                  <TableCell>{rep.problema}</TableCell>
                  <TableCell>{rep.nombre_cliente}</TableCell>
                  <TableCell>{rep.cedula}</TableCell>
                  <TableCell>{rep.celular}</TableCell>
                  <TableCell>{rep.direccion}</TableCell>
                  <TableCell>{rep.fecha_asignacion}</TableCell>
                  <TableCell>{rep.fecha_preparado || "—"}</TableCell>
                  <TableCell>{rep.estado}</TableCell>
                  <TableCell>{rep.observacion || "—"}</TableCell>
                  <TableCell>${rep.precio_servicio}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => abrirModal(rep)}
                    >
                      Actualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reparaciones.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    No hay reparaciones asignadas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MODAL DE ACTUALIZACIÓN */}
      <Dialog open={modalAbierto} onClose={cerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle>Actualizar Reparación</DialogTitle>
        <DialogContent dividers>
          {reparacionSeleccionada && (
            <>
              <TextField
                label="ID Reparación"
                fullWidth
                margin="dense"
                value={
                  reparacionSeleccionada.id_reparacion ||
                  reparacionSeleccionada.id
                }
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Equipo"
                fullWidth
                margin="dense"
                value={reparacionSeleccionada.equipo}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Problema"
                fullWidth
                margin="dense"
                value={reparacionSeleccionada.problema}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Cliente"
                fullWidth
                margin="dense"
                value={reparacionSeleccionada.nombre_cliente}
                InputProps={{ readOnly: true }}
              />
              <TextField
                select
                label="Estado"
                fullWidth
                margin="dense"
                value={reparacionSeleccionada.estado}
                onChange={(e) =>
                  setReparacionSeleccionada({
                    ...reparacionSeleccionada,
                    estado: e.target.value,
                  })
                }
              >
                {estados.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {estado}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Observación"
                fullWidth
                multiline
                rows={3}
                margin="dense"
                value={reparacionSeleccionada.observacion ?? ""}
                onChange={(e) =>
                  setReparacionSeleccionada({
                    ...reparacionSeleccionada,
                    observacion: e.target.value,
                  })
                }
              />

              <TextField
                label="Precio"
                type="number"
                fullWidth
                margin="dense"
                value={reparacionSeleccionada.precio_servicio ?? ""}
                onChange={(e) =>
                  setReparacionSeleccionada({
                    ...reparacionSeleccionada,
                    precio_servicio: e.target.value,
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal}>Cancelar</Button>
          <Button variant="contained" onClick={guardarCambios} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultarReparacionAsignada;

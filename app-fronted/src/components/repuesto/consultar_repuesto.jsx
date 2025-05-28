import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";

const ConsultarRepuesto = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalStock, setModalStock] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [mensajeStock, setMensajeStock] = useState({ tipo: "", texto: "" });
  const [mensajeEstado, setMensajeEstado] = useState({ tipo: "", texto: "" });
  const [cantidadStock, setCantidadStock] = useState(0);

  useEffect(() => {
    obtenerRepuestos();
  }, []);

  const obtenerRepuestos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3200/repair/repuesto");
      setRepuestos(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener repuestos:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (repuesto) => {
    setRepuestoSeleccionado(repuesto);
    setMensaje({ tipo: "", texto: "" });
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    setRepuestoSeleccionado(null);
  };

  const abrirModalStock = (repuesto) => {
    setRepuestoSeleccionado(repuesto);
    setCantidadStock(0);
    setMensajeStock({ tipo: "", texto: "" });
    setModalStock(true);
  };

  const cerrarModalStock = () => {
    setModalStock(false);
    setRepuestoSeleccionado(null);
  };

  const abrirModalEstado = (repuesto) => {
    setRepuestoSeleccionado(repuesto);
    setMensajeEstado({ tipo: "", texto: "" });
    setModalEstado(true);
  };

  const cerrarModalEstado = () => {
    setModalEstado(false);
    setRepuestoSeleccionado(null);
    setMensajeEstado({ tipo: "", texto: "" });
  };

  const cancelarCambioEstado = () => {
    setMensajeEstado({
      tipo: "info",
      texto: "Se canceló el cambio de estado.",
    });
    setTimeout(() => {
      cerrarModalEstado();
    }, 2000);
  };

  const aceptarCambioEstado = async () => {
    if (!repuestoSeleccionado) return;

    const nuevoEstado =
      repuestoSeleccionado.estado === "Activo" ? "Inactivo" : "Activo";

    try {
      await axios.put("http://localhost:3200/repair/repuesto/status", {
        id: repuestoSeleccionado.id,
        estado: nuevoEstado,
      });

      setRepuestos((prev) =>
        prev.map((rep) =>
          rep.id === repuestoSeleccionado.id
            ? { ...rep, estado: nuevoEstado }
            : rep
        )
      );

      setMensajeEstado({
        tipo: "success",
        texto: "Estado de repuesto actualizado correctamente.",
      });

      setTimeout(() => {
        cerrarModalEstado();
      }, 2000);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setMensajeEstado({
        tipo: "error",
        texto: "Error al cambiar estado. Intenta de nuevo.",
      });
    }
  };

  const guardarCambios = async () => {
    try {
      const { id, codigo, descripcion, precio } = repuestoSeleccionado;
      const response = await axios.put(
        "http://localhost:3200/repair/repuesto",
        {
          id,
          codigo,
          descripcion,
          precio,
        }
      );
      setMensaje({ tipo: "success", texto: response.data.message });
      setTimeout(() => {
        cerrarModal();
        obtenerRepuestos();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar repuesto:", error);
      let mensajeError = "Error al actualizar.";
      if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      }
      setMensaje({ tipo: "error", texto: mensajeError });
    }
  };

  const guardarStock = async () => {
    try {
      const { id } = repuestoSeleccionado;
      const response = await axios.put(
        "http://localhost:3200/repair/repuesto/stock",
        {
          id,
          cantidad: Number(cantidadStock),
        }
      );
      setMensajeStock({ tipo: "success", texto: response.data.message });
      setTimeout(() => {
        cerrarModalStock();
        obtenerRepuestos();
      }, 2000);
    } catch (error) {
      console.error("Error al modificar stock:", error);
      let mensajeError = "Error al modificar el stock.";
      if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      }
      setMensajeStock({ tipo: "error", texto: mensajeError });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Repuestos
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
                <TableCell sx={{ color: "#fff" }}>Código</TableCell>
                <TableCell sx={{ color: "#fff" }}>Descripción</TableCell>
                <TableCell sx={{ color: "#fff" }}>Stock</TableCell>
                <TableCell sx={{ color: "#fff" }}>Precio</TableCell>
                <TableCell sx={{ color: "#fff" }}>Estado</TableCell>
                <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repuestos.map((rep, index) => (
                <TableRow key={rep.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{rep.codigo}</TableCell>
                  <TableCell>{rep.descripcion}</TableCell>
                  <TableCell>{rep.stock}</TableCell>
                  <TableCell>${rep.precio}</TableCell>
                  <TableCell>{rep.estado}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => abrirModal(rep)}
                      sx={{ mr: 1 }}
                    >
                      Actualizar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => abrirModalStock(rep)}
                      sx={{ mr: 1 }}
                    >
                      Stock
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => abrirModalEstado(rep)}
                    >
                      Cambio de estado
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {repuestos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No hay repuestos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MODAL ACTUALIZAR */}
      <Dialog open={modal} onClose={cerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle>Actualizar Repuesto</DialogTitle>
        <DialogContent dividers>
          {mensaje.texto && (
            <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
              {mensaje.texto}
            </Alert>
          )}
          {repuestoSeleccionado && (
            <>
              <TextField
                label="ID"
                fullWidth
                margin="dense"
                value={repuestoSeleccionado.id}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Código"
                fullWidth
                margin="dense"
                value={repuestoSeleccionado.codigo}
                onChange={(e) =>
                  setRepuestoSeleccionado({
                    ...repuestoSeleccionado,
                    codigo: e.target.value,
                  })
                }
              />
              <TextField
                label="Descripción"
                fullWidth
                margin="dense"
                value={repuestoSeleccionado.descripcion}
                onChange={(e) =>
                  setRepuestoSeleccionado({
                    ...repuestoSeleccionado,
                    descripcion: e.target.value,
                  })
                }
              />
              <TextField
                label="Precio"
                type="number"
                fullWidth
                margin="dense"
                value={repuestoSeleccionado.precio}
                onChange={(e) =>
                  setRepuestoSeleccionado({
                    ...repuestoSeleccionado,
                    precio: e.target.value,
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal}>Cancelar</Button>
          <Button variant="contained" onClick={guardarCambios} color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL STOCK */}
      <Dialog
        open={modalStock}
        onClose={cerrarModalStock}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Modificar Stock</DialogTitle>
        <DialogContent dividers>
          {mensajeStock.texto && (
            <Alert severity={mensajeStock.tipo} sx={{ mb: 2 }}>
              {mensajeStock.texto}
            </Alert>
          )}
          {repuestoSeleccionado && (
            <>
              <TextField
                label="Código"
                fullWidth
                margin="dense"
                value={repuestoSeleccionado.codigo}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Stock actual"
                fullWidth
                margin="dense"
                value={repuestoSeleccionado.stock}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Cantidad a modificar"
                type="number"
                fullWidth
                margin="dense"
                value={cantidadStock}
                onChange={(e) => setCantidadStock(e.target.value)}
                helperText="Ingresa valores positivos o negativos"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModalStock}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={guardarStock}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL ESTADO */}
      <Dialog
        open={modalEstado}
        onClose={cerrarModalEstado}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Cambiar Estado</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Desea cambiar el estado del repuesto{" "}
            <strong>{repuestoSeleccionado?.codigo}</strong>?
          </Typography>
          {mensajeEstado.texto && (
            <Alert severity={mensajeEstado.tipo} sx={{ mt: 2 }}>
              {mensajeEstado.texto}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarCambioEstado} color="secondary">
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={aceptarCambioEstado}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultarRepuesto;

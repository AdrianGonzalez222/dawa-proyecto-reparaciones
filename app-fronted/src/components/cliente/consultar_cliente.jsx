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
  Modal,
  TextField,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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

const ConsultarCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteEditado, setClienteEditado] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mensajeEliminar, setMensajeEliminar] = useState({
    tipo: "",
    texto: "",
  });

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3200/repair/usuario/cliente/list"
      );
      const clientesActivos = response.data.data.filter(
        (cliente) => cliente.estado === "activo"
      );
      setClientes(clientesActivos);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cliente) => {
    setClienteEditado({ ...cliente });
    setMensaje({ tipo: "", texto: "" });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setClienteEditado(null);
    setMensaje({ tipo: "", texto: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handleAceptarCambios = async () => {
    try {
      const payload = {
        id_usuario: clienteEditado.id,
        cedula: clienteEditado.cedula,
        nombres: clienteEditado.nombres,
        apellidos: clienteEditado.apellidos,
        celular: clienteEditado.celular,
        direccion: clienteEditado.direccion,
        username: clienteEditado.username,
        email: clienteEditado.email,
        password: clienteEditado.password,
      };

      await axios.put("http://localhost:3200/repair/usuario/cliente", payload);

      setMensaje({
        tipo: "success",
        texto: "Cliente actualizado correctamente.",
      });

      setTimeout(() => {
        handleCloseModal();
        obtenerClientes();
      }, 2000);
    } catch (error) {
      let msg = "Error al actualizar.";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setMensaje({ tipo: "error", texto: msg });
    }
  };

  const handleOpenDialog = (cliente) => {
    setClienteSeleccionado(cliente);
    setMensajeEliminar({ tipo: "", texto: "" });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setClienteSeleccionado(null);
    setDialogOpen(false);
    setMensajeEliminar({ tipo: "", texto: "" });
  };

  const handleConfirmarCambioEstado = async () => {
    try {
      const payload = {
        id: clienteSeleccionado.id,
        estado: "inactivo",
      };

      await axios.put("http://localhost:3200/repair/usuario/status", payload);

      setMensajeEliminar({
        tipo: "success",
        texto: "Estado del cliente actualizado correctamente.",
      });

      setTimeout(() => {
        setDialogOpen(false);
        setClienteSeleccionado(null);
        obtenerClientes();
      }, 1500);
    } catch (error) {
      let msg = "Error al cambiar el estado.";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setMensajeEliminar({ tipo: "error", texto: msg });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Clientes
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
                <TableCell sx={{ color: "#fff" }}>Cédula</TableCell>
                <TableCell sx={{ color: "#fff" }}>Nombres</TableCell>
                <TableCell sx={{ color: "#fff" }}>Apellidos</TableCell>
                <TableCell sx={{ color: "#fff" }}>Celular</TableCell>
                <TableCell sx={{ color: "#fff" }}>Dirección</TableCell>
                <TableCell sx={{ color: "#fff" }}>Usuario</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente, index) => (
                <TableRow key={cliente.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{cliente.cedula}</TableCell>
                  <TableCell>{cliente.nombres}</TableCell>
                  <TableCell>{cliente.apellidos}</TableCell>
                  <TableCell>{cliente.celular}</TableCell>
                  <TableCell>{cliente.direccion}</TableCell>
                  <TableCell>{cliente.username}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal(cliente)}
                      >
                        Actualizar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOpenDialog(cliente)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {clientes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No hay clientes disponibles.
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
            Editar Cliente
          </Typography>

          {mensaje.texto && (
            <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
              {mensaje.texto}
            </Alert>
          )}

          {clienteEditado && (
            <>
              <TextField
                label="ID Usuario"
                name="id"
                fullWidth
                margin="normal"
                value={clienteEditado.id || ""}
                disabled
              />
              <TextField
                label="Cédula"
                name="cedula"
                fullWidth
                margin="normal"
                value={clienteEditado.cedula || ""}
                disabled
              />
              <TextField
                label="Nombres"
                name="nombres"
                fullWidth
                margin="normal"
                value={clienteEditado.nombres || ""}
                onChange={handleChange}
              />
              <TextField
                label="Apellidos"
                name="apellidos"
                fullWidth
                margin="normal"
                value={clienteEditado.apellidos || ""}
                onChange={handleChange}
              />
              <TextField
                label="Celular"
                name="celular"
                fullWidth
                margin="normal"
                value={clienteEditado.celular || ""}
                onChange={handleChange}
              />
              <TextField
                label="Dirección"
                name="direccion"
                fullWidth
                margin="normal"
                value={clienteEditado.direccion || ""}
                onChange={handleChange}
              />
              <TextField
                label="Usuario"
                name="username"
                fullWidth
                margin="normal"
                value={clienteEditado.username || ""}
                onChange={handleChange}
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={clienteEditado.password || ""}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                value={clienteEditado.email || ""}
                onChange={handleChange}
              />

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAceptarCambios}
                >
                  Aceptar
                </Button>
                <Button
                  variant="outlined"
                  sx={{ ml: 2 }}
                  onClick={handleCloseModal}
                >
                  Cancelar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Cambiar Estado del Cliente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea cambiar el estado del cliente{" "}
            <strong>{clienteSeleccionado?.nombres}</strong> a inactivo?
          </DialogContentText>
          {mensajeEliminar.texto && (
            <Alert severity={mensajeEliminar.tipo} sx={{ mt: 2 }}>
              {mensajeEliminar.texto}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmarCambioEstado}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultarCliente;

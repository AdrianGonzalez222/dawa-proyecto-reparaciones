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
  Modal,
  TextField,
  CircularProgress,
  Alert,
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

const CrearReparacion = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [equipo, setEquipo] = useState("");
  const [problema, setProblema] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3200/repair/reparacion"
      );
      setClientes(response.data.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (cliente) => {
    setClienteSeleccionado(cliente);
    setEquipo("");
    setProblema("");
    setMensaje({ tipo: "", texto: "" });
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setClienteSeleccionado(null);
  };

  const handleSubmit = async () => {
    if (!equipo || !problema) {
      setMensaje({
        tipo: "error",
        texto: "Todos los campos son obligatorios.",
      });
      return;
    }

    try {
      const payload = {
        id_cliente: clienteSeleccionado.id,
        equipo,
        problema,
      };

      await axios.post("http://localhost:3200/repair/reparacion", payload);

      setMensaje({
        tipo: "success",
        texto: "Reparación registrada correctamente.",
      });

      setTimeout(() => {
        cerrarModal();
      }, 2000);
    } catch (error) {
      console.error("Error al registrar la reparación:", error);
      const msg =
        error.response?.data?.message || "Error al registrar la reparación.";
      setMensaje({ tipo: "error", texto: msg });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Reparación
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
                <TableCell sx={{ color: "#fff" }}>Nombre</TableCell>
                <TableCell sx={{ color: "#fff" }}>Celular</TableCell>
                <TableCell sx={{ color: "#fff" }}>Dirección</TableCell>
                <TableCell sx={{ color: "#fff" }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente, index) => (
                <TableRow key={cliente.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{cliente.cedula}</TableCell>
                  <TableCell>{cliente.nombre_cliente}</TableCell>
                  <TableCell>{cliente.celular}</TableCell>
                  <TableCell>{cliente.direccion}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => abrirModal(cliente)}
                    >
                      Ingresar Reparación
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {clientes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay clientes activos disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={modalOpen} onClose={cerrarModal}>
        <Box sx={styleModal}>
          <Typography variant="h6" gutterBottom>
            Ingresar Reparación para:{" "}
            <strong>{clienteSeleccionado?.nombre_cliente}</strong>
          </Typography>

          {mensaje.texto && (
            <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
              {mensaje.texto}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Equipo"
            value={equipo}
            onChange={(e) => setEquipo(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Problema"
            value={problema}
            onChange={(e) => setProblema(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleSubmit}>
              Registrar
            </Button>
            <Button sx={{ ml: 2 }} onClick={cerrarModal}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CrearReparacion;

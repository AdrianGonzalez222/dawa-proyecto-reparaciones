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
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AgregarRepuestoReparacion = () => {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [repuestos, setRepuestos] = useState([]);
  const [cantidadMap, setCantidadMap] = useState({});
  const [repuestosAsignados, setRepuestosAsignados] = useState({});

  // Función para cargar reparaciones y repuestos asignados
  const obtenerReparacionesConRepuestos = async (id_tecnico) => {
    try {
      const response = await axios.post(
        "http://localhost:3200/repair/reparacion/list/task",
        { id_tecnico }
      );

      const reparacionesData = response.data.data;

      const promises = reparacionesData.map(async (rep) => {
        const res = await axios.post(
          "http://localhost:3200/repair/reparacion/list/task/inventory",
          { id_reparacion: rep.id }
        );
        return { id: rep.id, asignados: res.data.data.asignados };
      });

      const repuestosData = await Promise.all(promises);

      const repuestosMap = {};
      repuestosData.forEach(({ id, asignados }) => {
        repuestosMap[id] = asignados;
      });

      setReparaciones(reparacionesData);
      setRepuestosAsignados(repuestosMap);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "No se pudieron cargar las reparaciones o repuestos.";
      setMensaje(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tecnico = JSON.parse(localStorage.getItem("tecnico"));
    if (tecnico?.id) {
      obtenerReparacionesConRepuestos(tecnico.id);
    } else {
      setMensaje("No se encontró información del técnico.");
      setLoading(false);
    }
  }, []);

  // Abrir modal y cargar repuestos disponibles
  const handleOpenModal = async (repair) => {
    setSelectedRepair(repair);
    try {
      const res = await axios.get("http://localhost:3200/repair/repuesto");
      setRepuestos(res.data.data);
      setModalOpen(true);
    } catch (error) {
      setMensaje("Error al cargar repuestos disponibles.");
      setTimeout(() => setMensaje(""), 2000);
    }
  };

  // Agregar repuesto a reparación
  const agregarRepuestoAReparacion = async (idRepuesto) => {
    const cantidad = cantidadMap[idRepuesto];
    if (!cantidad || cantidad <= 0) {
      setMensaje("Cantidad inválida.");
      setTimeout(() => setMensaje(""), 2000);
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3200/repair/reparacion/list/task/inventory/add",
        {
          cantidad,
          id_reparacion: selectedRepair.id,
          id_repuesto: idRepuesto,
        }
      );
      setMensaje(res.data.message || "Repuesto agregado correctamente.");
      setCantidadMap((prev) => ({ ...prev, [idRepuesto]: "" }));

      const nuevosAsignados = repuestosAsignados[selectedRepair.id] || [];
      const repuestoExistenteIndex = nuevosAsignados.findIndex(
        (r) => r.id === idRepuesto
      );
      if (repuestoExistenteIndex !== -1) {
        nuevosAsignados[repuestoExistenteIndex].cantidad += cantidad;
      } else {
        const repuestoAgregado = repuestos.find((r) => r.id === idRepuesto);
        if (repuestoAgregado) {
          nuevosAsignados.push({
            id: repuestoAgregado.id,
            codigo: repuestoAgregado.codigo,
            cantidad,
            descripcion: repuestoAgregado.descripcion,
            precio: repuestoAgregado.precio,
          });
        }
      }
      setRepuestosAsignados({
        ...repuestosAsignados,
        [selectedRepair.id]: nuevosAsignados,
      });

      setTimeout(() => {
        setModalOpen(false);
        setMensaje("");
      }, 2000);
    } catch (error) {
      setMensaje(
        error.response?.data?.message ||
          "Error al agregar repuesto a reparación."
      );
      setTimeout(() => setMensaje(""), 2000);
    }
  };

  // Quitar repuesto asignado
  const quitarRepuestoAsignado = async (id_reparacion, id_repuesto) => {
    try {
      const res = await axios.post(
        "http://localhost:3200/repair/reparacion/list/task/inventory/del",
        {
          id_reparacion,
          id_repuesto,
        }
      );

      setMensaje(res.data.message || "Repuesto eliminado correctamente.");

      const nuevosAsignados = repuestosAsignados[id_reparacion].filter(
        (r) => r.id !== id_repuesto
      );
      setRepuestosAsignados({
        ...repuestosAsignados,
        [id_reparacion]: nuevosAsignados,
      });

      setTimeout(() => setMensaje(""), 2000);
    } catch (error) {
      setMensaje(
        error.response?.data?.message ||
          "Error al eliminar repuesto de reparación."
      );
      setTimeout(() => setMensaje(""), 2000);
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
      ) : mensaje ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "#fff" }}>#</TableCell>
                <TableCell sx={{ color: "#fff" }}>Cliente</TableCell>
                <TableCell sx={{ color: "#fff" }}>Equipo</TableCell>
                <TableCell sx={{ color: "#fff" }}>Problema</TableCell>
                <TableCell sx={{ color: "#fff" }}>Fecha Asignación</TableCell>
                <TableCell sx={{ color: "#fff" }}>Repuesto Usado</TableCell>
                <TableCell sx={{ color: "#fff" }}>Acción</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reparaciones.map((reparacion, index) => (
                <TableRow key={reparacion.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{reparacion.nombre_cliente}</TableCell>
                  <TableCell>{reparacion.equipo}</TableCell>
                  <TableCell>{reparacion.problema}</TableCell>
                  <TableCell>{reparacion.fecha_asignacion}</TableCell>
                  <TableCell>
                    {repuestosAsignados[reparacion.id]?.length > 0 ? (
                      repuestosAsignados[reparacion.id].map((r) => (
                        <Box
                          key={r.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography>
                            {r.cantidad} x {r.codigo}
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            onClick={() =>
                              quitarRepuestoAsignado(reparacion.id, r.id)
                            }
                          >
                            Eliminar
                          </Button>
                        </Box>
                      ))
                    ) : (
                      <em>No asignado</em>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(reparacion)}
                    >
                      Agregar Repuesto
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Agregar repuesto a reparación</Typography>
            <IconButton onClick={() => setModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" gutterBottom>
            Reparación: #{selectedRepair?.id} - Equipo: {selectedRepair?.equipo}
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repuestos.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell>{rep.codigo}</TableCell>
                  <TableCell>{rep.stock}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={cantidadMap[rep.id] || ""}
                      onChange={(e) =>
                        setCantidadMap({
                          ...cantidadMap,
                          [rep.id]: parseInt(e.target.value),
                        })
                      }
                      inputProps={{ min: 1, max: rep.stock }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => agregarRepuestoAReparacion(rep.id)}
                    >
                      Agregar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Modal>
    </Box>
  );
};

export default AgregarRepuestoReparacion;

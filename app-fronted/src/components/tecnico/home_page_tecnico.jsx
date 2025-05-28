import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

import CrearReparacion from "../reparacion/crear_reparacion";
import ConsultarReparaciones from "../reparacion/consultar_reparacion_tecnico";
import ConsultarReparacionesAsignadas from "../reparacion/consultar_reparacion_asignada";

// Importar componentes Inventario
import RegistrarRepuesto from "../repuesto/registrar_repuesto";
import ConsultarRepuesto from "../repuesto/consultar_repuesto";
import AgregarRepuestoAReparacion from "../repuesto/agregar_repuesto_reparacion";

// Importar componentes Facturación
import RegisterFactura from "../facturacion/register_factura";
import ConsultarFactura from "../facturacion/consultar_factura";

const HomePageTecnico = () => {
  const [username, setUsername] = useState("");
  const [openUserModal, setOpenUserModal] = useState(false);

  // Estados para menús desplegables
  const [anchorElReparacion, setAnchorElReparacion] = useState(null);
  const [anchorElInventario, setAnchorElInventario] = useState(null);
  const [anchorElFacturacion, setAnchorElFacturacion] = useState(null);

  const [selectedComponent, setSelectedComponent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "tecnico") {
      navigate("/", { replace: true });
    } else {
      setUsername(storedUser.username);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // Manejadores menú Reparación
  const handleReparacionClick = (event) => {
    setAnchorElReparacion(event.currentTarget);
  };
  const handleReparacionOption = (option) => {
    setAnchorElReparacion(null);
    setSelectedComponent(option);
  };

  // Manejadores menú Inventario
  const handleInventarioClick = (event) => {
    setAnchorElInventario(event.currentTarget);
  };
  const handleInventarioOption = (option) => {
    setAnchorElInventario(null);
    setSelectedComponent(option);
  };

  // Manejadores menú Facturación
  const handleFacturacionClick = (event) => {
    setAnchorElFacturacion(event.currentTarget);
  };
  const handleFacturacionOption = (option) => {
    setAnchorElFacturacion(null);
    setSelectedComponent(option);
  };

  const renderContent = () => {
    switch (selectedComponent) {
      // Reparación
      case "crear_reparacion":
        return <CrearReparacion />;
      case "consultar_reparaciones":
        return <ConsultarReparaciones />;
      case "consultar_reparaciones_asignadas":
        return <ConsultarReparacionesAsignadas />;
      // Inventario
      case "registrar_repuesto":
        return <RegistrarRepuesto />;
      case "consultar_repuesto":
        return <ConsultarRepuesto />;
      case "agregar_repuesto_reparacion":
        return <AgregarRepuestoAReparacion />;
      // Facturación
      case "registrar_factura":
        return <RegisterFactura />;
      case "consultar_factura":
        return <ConsultarFactura />;
      default:
        return null;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Bienvenido, {username}
          </Typography>
          <IconButton color="inherit" onClick={() => setOpenUserModal(true)}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <AppBar
        position="static"
        sx={{ backgroundColor: "#f0f0f0", color: "black" }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Button onMouseEnter={handleReparacionClick}>Reparación</Button>
          <Button onMouseEnter={handleInventarioClick}>Inventario</Button>
          <Button onMouseEnter={handleFacturacionClick}>Facturación</Button>
        </Toolbar>
      </AppBar>

      {/* Submenú Reparación */}
      <Menu
        anchorEl={anchorElReparacion}
        open={Boolean(anchorElReparacion)}
        onClose={() => setAnchorElReparacion(null)}
        MenuListProps={{ onMouseLeave: () => setAnchorElReparacion(null) }}
      >
        <MenuItem onClick={() => handleReparacionOption("crear_reparacion")}>
          Crear Reparación
        </MenuItem>
        <MenuItem
          onClick={() => handleReparacionOption("consultar_reparaciones")}
        >
          Consultar Reparaciones Pendientes
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleReparacionOption("consultar_reparaciones_asignadas")
          }
        >
          Consultar Reparaciones Asignadas
        </MenuItem>
      </Menu>

      {/* Submenú Inventario */}
      <Menu
        anchorEl={anchorElInventario}
        open={Boolean(anchorElInventario)}
        onClose={() => setAnchorElInventario(null)}
        MenuListProps={{ onMouseLeave: () => setAnchorElInventario(null) }}
      >
        <MenuItem onClick={() => handleInventarioOption("registrar_repuesto")}>
          Registrar Repuesto
        </MenuItem>
        <MenuItem onClick={() => handleInventarioOption("consultar_repuesto")}>
          Consultar Repuesto
        </MenuItem>
        <MenuItem
          onClick={() => handleInventarioOption("agregar_repuesto_reparacion")}
        >
          Agregar Repuesto a Reparación
        </MenuItem>
      </Menu>

      {/* Submenú Facturación */}
      <Menu
        anchorEl={anchorElFacturacion}
        open={Boolean(anchorElFacturacion)}
        onClose={() => setAnchorElFacturacion(null)}
        MenuListProps={{ onMouseLeave: () => setAnchorElFacturacion(null) }}
      >
        <MenuItem onClick={() => handleFacturacionOption("registrar_factura")}>
          Registrar Factura
        </MenuItem>
        <MenuItem onClick={() => handleFacturacionOption("consultar_factura")}>
          Consultar Factura
        </MenuItem>
      </Menu>

      {/* Contenido dinámico */}
      <Box sx={{ padding: 3 }}>{renderContent()}</Box>

      {/* Modal Usuario */}
      <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)}>
        <DialogTitle>Opciones de Usuario</DialogTitle>
        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            fullWidth
          >
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HomePageTecnico;

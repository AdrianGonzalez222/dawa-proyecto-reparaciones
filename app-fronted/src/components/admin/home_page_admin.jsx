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

// Componentes Técnico y Cliente
import RegisterTecnico from "../tecnico/register_tecnico";
import ConsultarTecnico from "../tecnico/consultar_tecnico";
import ConsultarCliente from "../cliente/consultar_cliente";

// Componentes Reparación
import CrearReparacion from "../reparacion/crear_reparacion";
import ConsultarReparaciones from "../reparacion/consultar_reparacion_tecnico";
import ConsultarReparacionesAsignadas from "../reparacion/consultar_reparacion_asignada";

// Componentes Inventario
import RegistrarRepuesto from "../repuesto/registrar_repuesto";
import ConsultarRepuesto from "../repuesto/consultar_repuesto";
import AgregarRepuestoAReparacion from "../repuesto/agregar_repuesto_reparacion";

// Componentes Factura
import RegisterFactura from "../facturacion/register_factura";
import ConsultarFactura from "../facturacion/consultar_factura";

const HomePageAdmin = () => {
  const [username, setUsername] = useState("");
  const [openUserModal, setOpenUserModal] = useState(false);
  const [anchorElTecnico, setAnchorElTecnico] = useState(null);
  const [anchorElCliente, setAnchorElCliente] = useState(null);
  const [anchorElReparacion, setAnchorElReparacion] = useState(null);
  const [anchorElInventario, setAnchorElInventario] = useState(null);
  const [anchorElFacturacion, setAnchorElFacturacion] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "admin") {
      navigate("/", { replace: true });
    } else {
      setUsername(storedUser.username);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // Menús desplegables
  const handleTecnicoClick = (event) => setAnchorElTecnico(event.currentTarget);
  const handleClienteClick = (event) => setAnchorElCliente(event.currentTarget);
  const handleReparacionClick = (event) =>
    setAnchorElReparacion(event.currentTarget);
  const handleInventarioClick = (event) =>
    setAnchorElInventario(event.currentTarget);
  const handleFacturacionClick = (event) =>
    setAnchorElFacturacion(event.currentTarget);

  const handleTecnicoOption = (option) => {
    setAnchorElTecnico(null);
    setSelectedComponent(option);
  };
  const handleClienteOption = (option) => {
    setAnchorElCliente(null);
    setSelectedComponent(option);
  };
  const handleReparacionOption = (option) => {
    setAnchorElReparacion(null);
    setSelectedComponent(option);
  };
  const handleInventarioOption = (option) => {
    setAnchorElInventario(null);
    setSelectedComponent(option);
  };
  const handleFacturacionOption = (option) => {
    setAnchorElFacturacion(null);
    setSelectedComponent(option);
  };

  const renderContent = () => {
    switch (selectedComponent) {
      case "registrar":
        return <RegisterTecnico />;
      case "consultar":
        return <ConsultarTecnico />;
      case "consultar_cliente":
        return <ConsultarCliente />;
      case "crear_reparacion":
        return <CrearReparacion />;
      case "consultar_reparaciones":
        return <ConsultarReparaciones />;
      case "consultar_reparaciones_asignadas":
        return <ConsultarReparacionesAsignadas />;
      case "registrar_repuesto":
        return <RegistrarRepuesto />;
      case "consultar_repuesto":
        return <ConsultarRepuesto />;
      case "agregar_repuesto_reparacion":
        return <AgregarRepuestoAReparacion />;
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
          <Button onMouseEnter={handleTecnicoClick}>Técnico</Button>
          <Button onMouseEnter={handleClienteClick}>Cliente</Button>
          <Button onMouseEnter={handleReparacionClick}>Reparación</Button>
          <Button onMouseEnter={handleInventarioClick}>Inventario</Button>
          <Button onMouseEnter={handleFacturacionClick}>Facturación</Button>
        </Toolbar>
      </AppBar>

      {/* Submenú Técnico */}
      <Menu
        anchorEl={anchorElTecnico}
        open={Boolean(anchorElTecnico)}
        onClose={() => setAnchorElTecnico(null)}
        MenuListProps={{ onMouseLeave: () => setAnchorElTecnico(null) }}
      >
        <MenuItem onClick={() => handleTecnicoOption("registrar")}>
          Registrar Técnico
        </MenuItem>
        <MenuItem onClick={() => handleTecnicoOption("consultar")}>
          Consultar Técnico
        </MenuItem>
      </Menu>

      {/* Submenú Cliente */}
      <Menu
        anchorEl={anchorElCliente}
        open={Boolean(anchorElCliente)}
        onClose={() => setAnchorElCliente(null)}
        MenuListProps={{ onMouseLeave: () => setAnchorElCliente(null) }}
      >
        <MenuItem onClick={() => handleClienteOption("consultar_cliente")}>
          Consultar Cliente
        </MenuItem>
      </Menu>

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

export default HomePageAdmin;
